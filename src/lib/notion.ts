import { Client } from "@notionhq/client";
import fs from "fs";
import path from "path";

// Initialize the Notion client
export const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

export const ROADMAP_DATABASE_ID = process.env.NOTION_ROADMAP_DATABASE_ID;
export const WIKI_DATABASE_ID = process.env.NOTION_WIKI_DATABASE_ID;

// Helper for raw fetch to Notion API
async function fetchNotionDatabase(databaseId: string, body: any = {}) {
    const url = `https://api.notion.com/v1/databases/${databaseId}/query`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.NOTION_API_KEY}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        next: { revalidate: 60 }
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Notion API error: ${response.status} ${error}`);
    }

    return response.json();
}

async function fetchNotionBlocks(blockId: string) {
    const url = `https://api.notion.com/v1/blocks/${blockId}/children`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${process.env.NOTION_API_KEY}`,
            "Notion-Version": "2022-06-28",
        },
        next: { revalidate: 60 }
    });
    if (!response.ok) return { results: [] };
    return response.json();
}

import crypto from "crypto";

async function downloadAndCacheImage(url: string, id: string, folder: string = "roadmap"): Promise<string> {
    try {
        const publicDir = path.join(process.cwd(), "public", "images", folder);
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        // Use a hash of the URL to detect changes (Notion signed URLs change when content changes)
        const urlHash = crypto.createHash('md5').update(url.split('?')[0]).digest('hex').substring(0, 8);
        const fileName = `${id}_${urlHash}.jpg`;
        const filePath = path.join(publicDir, fileName);
        const publicPath = `/images/${folder}/${fileName}`;

        if (!fs.existsSync(filePath)) {
            // Remove old versions of this image to save space
            if (fs.existsSync(publicDir)) {
                const files = fs.readdirSync(publicDir);
                files.forEach(file => {
                    if (file.startsWith(id) && file !== fileName) {
                        try { fs.unlinkSync(path.join(publicDir, file)); } catch (e) { }
                    }
                });
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            fs.writeFileSync(filePath, buffer);
        }

        return publicPath;
    } catch (e) {
        console.error("Failed to download image", e);
        return "/images/logo.png";
    }
}

// Helper to fetch roadmap items
export async function getLiveRoadmap() {
    if (!process.env.NOTION_API_KEY || !ROADMAP_DATABASE_ID) {
        console.warn("Missing Notion API Key or Roadmap Database ID");
        return [];
    }

    try {
        const response = await fetchNotionDatabase(ROADMAP_DATABASE_ID, {
            sorts: [
                {
                    property: "Date",
                    direction: "descending",
                },
            ],
            page_size: 3,
        });

        const items = await Promise.all(response.results.map(async (page: any) => {
            const item: any = {
                id: page.id,
                title: page.properties.Entry?.title[0]?.plain_text || "Untitled",
                status: page.properties.Category?.multi_select?.[0]?.name || "Update",
                date: page.properties.Date?.date?.start || "",
                description: page.properties.Notes?.rich_text[0]?.plain_text || "",
                imageUrl: "/images/logo.png"
            };

            let imageUrl = page.icon?.external?.url || page.icon?.file?.url || page.cover?.external?.url || page.cover?.file?.url;

            if (!imageUrl) {
                const blocksData = await fetchNotionBlocks(page.id);
                const imageBlock = blocksData.results.find((b: any) => b.type === "image");
                if (imageBlock) {
                    imageUrl = imageBlock.image?.file?.url || imageBlock.image?.external?.url;
                }
            }

            if (imageUrl) {
                item.imageUrl = await downloadAndCacheImage(imageUrl, page.id);
            }

            return item;
        }));

        return items;
    } catch (error) {
        console.error("Error fetching roadmap:", error);
        return [];
    }
}

// Helper to fetch wiki articles
export async function getWikiArticles() {
    if (!process.env.NOTION_API_KEY || !WIKI_DATABASE_ID) {
        console.warn("Missing Notion API Key or Wiki Database ID");
        return [];
    }

    try {
        const response = await fetchNotionDatabase(WIKI_DATABASE_ID, {});

        const items = await Promise.all(response.results.map(async (page: any) => {
            const title = page.properties['Indicator Name']?.title[0]?.plain_text || "Untitled";
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const tags = page.properties['Tags']?.multi_select?.map((t: any) => t.name) || [];
            const indicatorUrl = page.properties['Indicator URL']?.url || "";
            const screenshotProp = page.properties['Screenshot'];
            let rawScreenshotUrl = "";
            if (screenshotProp?.files?.[0]) {
                rawScreenshotUrl = screenshotProp.files[0].file?.url || screenshotProp.files[0].external?.url || "";
            }

            const item: any = {
                id: page.id,
                title: title,
                slug: slug,
                tags: tags,
                category: page.properties.Suite?.select?.name || "General",
                summary: page.properties['Core Concept']?.rich_text[0]?.plain_text || "",
                imageUrl: "/images/logo.png",
                screenshotUrl: "",
                indicatorUrl: indicatorUrl
            };

            let imageUrl = page.cover?.external?.url || page.cover?.file?.url;

            if (!imageUrl) {
                const blocksData = await fetchNotionBlocks(page.id);
                // Look for first image block
                const imageBlock = blocksData.results.find((b: any) => b.type === "image");
                if (imageBlock) {
                    imageUrl = imageBlock.image?.file?.url || imageBlock.image?.external?.url;
                }
            }

            const imageOps = [];
            if (imageUrl) {
                imageOps.push((async () => {
                    item.imageUrl = await downloadAndCacheImage(imageUrl as string, page.id, "wiki");
                })());
            }

            if (rawScreenshotUrl) {
                imageOps.push((async () => {
                    item.screenshotUrl = await downloadAndCacheImage(rawScreenshotUrl, `${page.id}_screenshot`, "wiki");
                })());
            }

            if (imageOps.length > 0) {
                await Promise.all(imageOps);
            }

            return item;
        }));

        return items;
    } catch (error) {
        console.error("Error fetching wiki articles:", error);
        return [];
    }
}

// Helper to fetch a single page content, including nested blocks
export async function getPageContent(pageId: string) {
    if (!process.env.NOTION_API_KEY) return [];

    try {
        const fetchBlocks = async (blockId: string): Promise<any[]> => {
            const response = await notion.blocks.children.list({
                block_id: blockId,
            });

            const blocks = await Promise.all(response.results.map(async (block: any) => {
                if (block.has_children) {
                    block[block.type].children = await fetchBlocks(block.id);
                }
                return block;
            }));

            return blocks;
        };

        return await fetchBlocks(pageId);
    } catch (error) {
        console.error("Error fetching page content:", error);
        return [];
    }
}
