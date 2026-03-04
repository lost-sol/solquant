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
        }
    });
    if (!response.ok) return { results: [] };
    return response.json();
}

async function downloadAndCacheImage(url: string, id: string, folder: string = "roadmap"): Promise<string> {
    try {
        const publicDir = path.join(process.cwd(), "public", "images", folder);
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        const filePath = path.join(publicDir, `${id}.jpg`);
        const publicPath = `/images/${folder}/${id}.jpg`;

        if (!fs.existsSync(filePath)) {
            const response = await fetch(url);
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

        const items = response.results.map((page: any) => {
            return {
                id: page.id,
                title: page.properties.Entry?.title[0]?.plain_text || "Untitled",
                status: page.properties.Category?.multi_select?.[0]?.name || "Update",
                date: page.properties.Date?.date?.start || "",
                description: page.properties.Notes?.rich_text[0]?.plain_text || "",
                imageUrl: "/images/logo.png",
                _rawPage: page
            };
        });

        for (const item of items) {
            let imageUrl = item._rawPage.icon?.external?.url || item._rawPage.icon?.file?.url || item._rawPage.cover?.external?.url || item._rawPage.cover?.file?.url;

            if (!imageUrl) {
                const blocksData = await fetchNotionBlocks(item.id);
                const imageBlock = blocksData.results.find((b: any) => b.type === "image");
                if (imageBlock) {
                    imageUrl = imageBlock.image?.file?.url || imageBlock.image?.external?.url;
                }
            }

            if (imageUrl) {
                item.imageUrl = await downloadAndCacheImage(imageUrl, item.id);
            }

            delete item._rawPage;
        }

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

        const items = response.results.map((page: any) => {
            const title = page.properties['Indicator Name']?.title[0]?.plain_text || "Untitled";
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const tags = page.properties['Tags']?.multi_select?.map((t: any) => t.name) || [];
            const indicatorUrl = page.properties['Indicator URL']?.url || "";
            const screenshotProp = page.properties['Screenshot'];
            let rawScreenshotUrl = "";
            if (screenshotProp?.files?.[0]) {
                rawScreenshotUrl = screenshotProp.files[0].file?.url || screenshotProp.files[0].external?.url || "";
            }

            return {
                id: page.id,
                title: title,
                slug: slug,
                tags: tags,
                category: page.properties.Suite?.select?.name || "General",
                summary: page.properties['Core Concept']?.rich_text[0]?.plain_text || "",
                imageUrl: "/images/logo.png",
                screenshotUrl: "",
                indicatorUrl: indicatorUrl,
                _rawPage: page,
                _rawScreenshotUrl: rawScreenshotUrl
            };
        });

        for (const item of items) {
            let imageUrl = item._rawPage.cover?.external?.url || item._rawPage.cover?.file?.url;

            if (!imageUrl) {
                const blocksData = await fetchNotionBlocks(item.id);
                // Look for first image block
                const imageBlock = blocksData.results.find((b: any) => b.type === "image");
                if (imageBlock) {
                    imageUrl = imageBlock.image?.file?.url || imageBlock.image?.external?.url;
                }
            }

            if (imageUrl) {
                item.imageUrl = await downloadAndCacheImage(imageUrl, item.id, "wiki");
            }

            if (item._rawScreenshotUrl) {
                item.screenshotUrl = await downloadAndCacheImage(item._rawScreenshotUrl, `${item.id}_screenshot`, "wiki");
            }

            delete item._rawPage;
            delete item._rawScreenshotUrl;
        }

        return items;
    } catch (error) {
        console.error("Error fetching wiki articles:", error);
        return [];
    }
}

// Helper to fetch a single page content
export async function getPageContent(pageId: string) {
    if (!process.env.NOTION_API_KEY) return [];

    try {
        const response = await notion.blocks.children.list({
            block_id: pageId,
        });
        return response.results;
    } catch (error) {
        console.error("Error fetching page content:", error);
        return [];
    }
}
