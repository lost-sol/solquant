import { Client } from "@notionhq/client";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

const ROADMAP_DATABASE_ID = process.env.NOTION_ROADMAP_DATABASE_ID;
const WIKI_DATABASE_ID = process.env.NOTION_WIKI_DATABASE_ID;

const publicDir = path.join(process.cwd(), "public", "images", "notion");
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

async function fetchNotionDatabase(databaseId, body = {}) {
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

async function fetchNotionBlocks(blockId) {
    let allBlocks = [];
    let hasMore = true;
    let nextCursor = undefined;

    while (hasMore) {
        const url = new URL(`https://api.notion.com/v1/blocks/${blockId}/children`);
        if (nextCursor) {
            url.searchParams.append("start_cursor", nextCursor);
        }

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${process.env.NOTION_API_KEY}`,
                "Notion-Version": "2022-06-28",
            },
        });
        
        if (!response.ok) break;
        
        const data = await response.json();
        const blocks = data.results || [];
        
        for (const block of blocks) {
            if (block.has_children) {
                block[block.type].children = await fetchNotionBlocks(block.id);
            }
        }
        
        allBlocks.push(...blocks);
        hasMore = data.has_more;
        nextCursor = data.next_cursor;
    }

    return allBlocks;
}

async function downloadAndCacheImage(url, id, folder = "notion") {
    if (!url) return "/images/logo.png";
    try {
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
            console.log(`Downloaded image: ${fileName}`);
        } else {
            console.log(`Using cached image: ${fileName}`);
        }

        return publicPath;
    } catch (e) {
        console.error(`Failed to download image ${url}`, e);
        return "/images/logo.png";
    }
}

async function replaceImageBlocksWithLocalPaths(blocks) {
    for (const block of blocks) {
        if (block.type === 'image') {
            const blockContent = block.image;
            const imageUrl = blockContent.file?.url || blockContent.external?.url;
            if (imageUrl) {
                // Determine if it's hosted by Notion or AWS
                const isNotionHosted = imageUrl.includes('amazonaws.com') || imageUrl.includes('notion-static.com') || imageUrl.includes('prod-files-secure');
                // Always download to ensure statically available
                const localPath = await downloadAndCacheImage(imageUrl, block.id, "notion");
                // Mutate the block to use external url pointing to local path
                block.image = {
                    type: "external",
                    external: { url: localPath }
                };
            }
        }
        
        // Recursive handling for child blocks
        const innerType = block[block.type];
        if (innerType && innerType.children) {
            await replaceImageBlocksWithLocalPaths(innerType.children);
        }
    }
}

async function buildRoadmap() {
    console.log("Fetching Roadmap...");
    const response = await fetchNotionDatabase(ROADMAP_DATABASE_ID, {
        sorts: [
            {
                property: "Date",
                direction: "descending",
            },
        ],
    });

    const items = await Promise.all(response.results.map(async (page) => {
        const item = {
            id: page.id,
            title: page.properties.Entry?.title[0]?.plain_text || "Untitled",
            status: page.properties.Category?.multi_select?.[0]?.name || "Update",
            date: page.properties.Date?.date?.start || "",
            description: page.properties.Notes?.rich_text[0]?.plain_text || "",
            imageUrl: "/images/logo.png"
        };

        const blocksData = await fetchNotionBlocks(page.id, false);

        // Fallback description from blocks if Notes is empty
        if (!item.description) {
            const firstParagraph = blocksData.find(b => b.type === 'paragraph');
            if (firstParagraph && firstParagraph.paragraph.rich_text.length > 0) {
                item.description = firstParagraph.paragraph.rich_text.map(t => t.plain_text).join("");
            }
        }

        let imageUrl = page.icon?.external?.url || page.icon?.file?.url || page.cover?.external?.url || page.cover?.file?.url;

        if (!imageUrl) {
            const imageBlock = blocksData.find((b) => b.type === "image");
            if (imageBlock) {
                imageUrl = imageBlock.image?.file?.url || imageBlock.image?.external?.url;
            }
        }

        if (imageUrl) {
            item.imageUrl = await downloadAndCacheImage(imageUrl, page.id, "notion");
        }

        return item;
    }));
    return items;
}

async function buildWiki() {
    console.log("Fetching Wiki...");
    const response = await fetchNotionDatabase(WIKI_DATABASE_ID, {});
    
    // We fetch pages first
    const items = await Promise.all(response.results.map(async (page) => {
        const title = page.properties['Indicator Name']?.title[0]?.plain_text || "Untitled";
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const tags = page.properties['Tags']?.multi_select?.map((t) => t.name) || [];
        const indicatorUrl = page.properties['Indicator URL']?.url || "";
        const screenshotProp = page.properties['Screenshot'];
        
        let rawScreenshotUrl = "";
        if (screenshotProp?.files?.[0]) {
            rawScreenshotUrl = screenshotProp.files[0].file?.url || screenshotProp.files[0].external?.url || "";
        }

        const item = {
            id: page.id,
            title: title,
            slug: slug,
            tags: tags,
            categories: page.properties.Suite?.multi_select?.map((s) => s.name) || ["General"],
            summary: page.properties['Core Concept']?.rich_text[0]?.plain_text || "",
            imageUrl: "/images/logo.png",
            screenshotUrl: "",
            indicatorUrl: indicatorUrl,
            blocks: []
        };

        // Get Blocks
        console.log(`Fetching blocks for wiki page: ${title}`);
        item.blocks = await fetchNotionBlocks(page.id);
        
        // Fetch Cover Image
        let imageUrl = page.cover?.external?.url || page.cover?.file?.url;
        if (!imageUrl) {
            const imageBlock = item.blocks.find((b) => b.type === "image");
            if (imageBlock) {
                imageUrl = imageBlock.image?.external?.url || imageBlock.image?.file?.url;
            }
        }

        // Scan blocks for local images - DO THIS AFTER extracting the cover URL
        // otherwise imageUrl above will pick up the mutated local path
        await replaceImageBlocksWithLocalPaths(item.blocks);

        if (imageUrl) {
            item.imageUrl = await downloadAndCacheImage(imageUrl, page.id, "notion");
        }

        if (rawScreenshotUrl) {
            item.screenshotUrl = await downloadAndCacheImage(rawScreenshotUrl, `${page.id}_screenshot`, "notion");
        }

        return item;
    }));
    return items;
}

async function main() {
    if (!process.env.NOTION_API_KEY) {
        console.error("Missing NOTION_API_KEY");
        process.exit(1);
    }
    
    try {
        const roadmap = await buildRoadmap();
        const wiki = await buildWiki();

        const data = {
            roadmap,
            wiki
        };

        const dataPath = path.join(process.cwd(), "src", "data", "notion-data.json");
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        
        console.log("Successfully fetched all Notion data to src/data/notion-data.json!");
    } catch (e) {
        console.error("Failed executing build step", e);
        process.exit(1);
    }
}

main();
