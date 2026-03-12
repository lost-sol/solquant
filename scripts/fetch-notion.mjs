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
const STRATEGY_DATABASE_ID = process.env.NOTION_STRATEGY_DATABASE_ID;
const EDUCATION_PAGE_ID = process.env.NOTION_EDUCATION_PAGE_ID;

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
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Notion blocks API error: ${response.status} ${error}`);
        }
        
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
            slug: (page.properties.Entry?.title[0]?.plain_text || "Untitled").toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            status: page.properties.Category?.multi_select?.[0]?.name || "Update",
            date: page.properties.Date?.date?.start || "",
            description: page.properties.Notes?.rich_text[0]?.plain_text || "",
            imageUrl: "/images/logo.png",
            blocks: []
        };

        const blocksData = await fetchNotionBlocks(page.id);
        item.blocks = blocksData;

        // Extract up to 2 preview paragraphs
        const paragraphs = blocksData
            .filter(b => b.type === 'paragraph' && b.paragraph.rich_text.length > 0)
            .slice(0, 2)
            .map(b => b.paragraph.rich_text.map(t => t.plain_text).join(""));
        item.previewParagraphs = paragraphs;

        // Extract up to 2 preview images
        const previewImages = [];
        
        // Priority 1: Cover or Icon (if it's an image)
        let mainImageUrl = page.icon?.external?.url || page.icon?.file?.url || page.cover?.external?.url || page.cover?.file?.url;
        if (mainImageUrl) previewImages.push(mainImageUrl);

        // Priority 2: Image blocks from content
        const imageBlocks = blocksData.filter(b => b.type === 'image');
        for (const block of imageBlocks) {
            if (previewImages.length >= 2) break;
            const blockUrl = block.image?.file?.url || block.image?.external?.url;
            if (blockUrl && !previewImages.includes(blockUrl)) {
                previewImages.push(blockUrl);
            }
        }
        
        // Localize all preview images and store in item
        item.previewImageUrls = await Promise.all(
            previewImages.map((url, idx) => downloadAndCacheImage(url, `${page.id}_preview_${idx}`, "notion"))
        );

        // Set the primary imageUrl for backward compatibility/summary
        if (item.previewImageUrls.length > 0) {
            item.imageUrl = item.previewImageUrls[0];
        }

        // Scan ALL blocks for local images for the detail page
        await replaceImageBlocksWithLocalPaths(item.blocks);

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

async function buildEducation() {
    console.log("Fetching Education...");
    
    // For Education, we fetch the children of EDUCATION_PAGE_ID
    // These children are expected to be "child_page" blocks
    const results = await fetchNotionBlocks(EDUCATION_PAGE_ID);
    const subPages = results.filter(block => block.type === 'child_page');

    console.log(`Found ${subPages.length} subpages in Education.`);

    const items = await Promise.all(subPages.map(async (pageBlock) => {
        const pageId = pageBlock.id;
        const pageTitle = pageBlock.child_page.title;
        const slug = pageTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // Fetch the full page object to get cover/icon
        const page = await notion.pages.retrieve({ page_id: pageId });

        const item = {
            id: pageId,
            title: pageTitle,
            slug: slug,
            categories: ["Education"],
            summary: "", // Will extract from blocks
            imageUrl: "/images/logo.png",
            blocks: []
        };

        // Get Blocks
        console.log(`Fetching blocks for education page: ${pageTitle}`);
        item.blocks = await fetchNotionBlocks(pageId);

        // Fallback description from blocks
        const firstParagraph = item.blocks.find(b => b.type === 'paragraph');
        if (firstParagraph && firstParagraph.paragraph.rich_text.length > 0) {
            item.summary = firstParagraph.paragraph.rich_text.map(t => t.plain_text).join("").substring(0, 160) + "...";
        }
        
        // Fetch Cover Image
        let imageUrl = page.cover?.external?.url || page.cover?.file?.url;
        if (!imageUrl) {
            const imageBlock = item.blocks.find((b) => b.type === "image");
            if (imageBlock) {
                imageUrl = imageBlock.image?.external?.url || imageBlock.image?.file?.url;
            }
        }

        // Only use icon as absolute last resort if it's an image, not emoji
        if (!imageUrl && page.icon?.type !== 'emoji') {
            imageUrl = page.icon?.external?.url || page.icon?.file?.url;
        }

        // Scan blocks for local images
        await replaceImageBlocksWithLocalPaths(item.blocks);

        if (imageUrl) {
            item.imageUrl = await downloadAndCacheImage(imageUrl, pageId, "notion");
        }

        return item;
    }));

    return items;
}

async function buildPolicies() {
    console.log("Fetching Policies (Terms, Privacy, About)...");
    
    const policyIds = {
        terms: "31c2e378b76a8072a38be76a188248d2",
        privacy: "31c2e378b76a80798de7de9b65b01aec",
        about: "31c2e378b76a804b9f91c10ea9801588"
    };

    const items = await Promise.all(Object.entries(policyIds).map(async ([slug, pageId]) => {
        // Fetch the full page object to get title
        const page = await notion.pages.retrieve({ page_id: pageId });
        const pageTitle = page.properties.title?.title[0]?.plain_text || page.properties.Name?.title[0]?.plain_text || slug.charAt(0).toUpperCase() + slug.slice(1);

        const item = {
            id: pageId,
            title: pageTitle,
            slug: slug,
            blocks: []
        };

        // Get Blocks
        console.log(`Fetching blocks for policy page: ${pageTitle}`);
        item.blocks = await fetchNotionBlocks(pageId);

        // Scan blocks for local images
        await replaceImageBlocksWithLocalPaths(item.blocks);

        return item;
    }));

    return items;
}

async function buildStrategies() {
    console.log("Fetching Strategies...");
    
    // First, get the backtest stats
    let stats = {};
    const { execSync } = await import('child_process');
    const fs = await import('fs');
    const path = await import('path');
    
    // Try to read pre-calculated stats first
    const statsPath = path.join(process.cwd(), 'src/data/backtest-stats.json');
    if (fs.existsSync(statsPath)) {
        try {
            stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
            console.log("Loaded pre-calculated backtest stats.");
        } catch (e) {
            console.error("Failed to parse backtest-stats.json:", e.message);
        }
    }
    
    // Fallback/Update if needed (optional, but keep it robust)
    if (Object.keys(stats).length === 0) {
        try {
            console.log("Running Python backtest stats extraction...");
            const pythonOutput = execSync(`/usr/bin/python3 scripts/extract_backtest_stats.py`, { 
                encoding: 'utf8'
            });
            stats = JSON.parse(pythonOutput);
            console.log("Successfully extracted backtest stats via Python");
        } catch (error) {
            console.error("Failed to extract backtest stats via Python:", error.message);
        }
    }

    const response = await fetchNotionDatabase(STRATEGY_DATABASE_ID, {});
    
    const items = await Promise.all(response.results.map(async (page) => {
        const title = page.properties['Indicator Name']?.title[0]?.plain_text || "Untitled";
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        const item = {
            id: page.id,
            title: title,
            slug: slug,
            summary: page.properties['Description']?.rich_text[0]?.plain_text || page.properties['Core Concept']?.rich_text[0]?.plain_text || "",
            imageUrl: "/images/logo.png",
            blocks: [],
            stats: stats[title] || null
        };

        // Get Blocks
        console.log(`Fetching blocks for strategy page: ${title}`);
        item.blocks = await fetchNotionBlocks(page.id);
        
        // Fetch Image (Cover or Screenshot property or first image block)
        let imageUrl = page.cover?.external?.url || page.cover?.file?.url;
        
        // Check 'Screenshot' property
        if (!imageUrl) {
            const screenshotProp = page.properties['Screenshot'];
            if (screenshotProp?.files?.length > 0) {
                imageUrl = screenshotProp.files[0].file?.url || screenshotProp.files[0].external?.url;
            }
        }
        if (!imageUrl) {
            const imageBlock = item.blocks.find((b) => b.type === "image");
            if (imageBlock) {
                imageUrl = imageBlock.image?.external?.url || imageBlock.image?.file?.url;
            }
        }

        // Scan blocks for local images
        await replaceImageBlocksWithLocalPaths(item.blocks);

        if (imageUrl) {
            item.imageUrl = await downloadAndCacheImage(imageUrl, page.id, "notion");
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
    
    const data = {
        roadmap: [],
        wiki: [],
        education: [],
        strategies: [],
        policies: []
    };

    if (!ROADMAP_DATABASE_ID) console.warn("WARNING: NOTION_ROADMAP_DATABASE_ID is not set. Roadmap will be empty.");
    if (!WIKI_DATABASE_ID) console.warn("WARNING: NOTION_WIKI_DATABASE_ID is not set. Wiki will be empty.");
    if (!EDUCATION_PAGE_ID) console.warn("WARNING: NOTION_EDUCATION_PAGE_ID is not set. Education will be empty.");
    if (!STRATEGY_DATABASE_ID) console.warn("WARNING: NOTION_STRATEGY_DATABASE_ID is not set. Strategies will be empty.");

    try {
        if (ROADMAP_DATABASE_ID) {
            data.roadmap = await buildRoadmap();
        }
    } catch (e) {
        console.error("Failed to build roadmap:", e.message);
    }

    try {
        if (WIKI_DATABASE_ID) {
            data.wiki = await buildWiki();
        }
    } catch (e) {
        console.error("Failed to build wiki:", e.message);
    }

    try {
        if (EDUCATION_PAGE_ID) {
            data.education = await buildEducation();
        }
    } catch (e) {
        console.error("Failed to build education:", e.message);
    }

    try {
        data.policies = await buildPolicies();
    } catch (e) {
        console.error("Failed to build policies:", e.message);
    }

    try {
        if (STRATEGY_DATABASE_ID) {
            data.strategies = await buildStrategies();
        }
    } catch (e) {
        console.error("Failed to build strategies:", e.message);
    }

    try {
        const dataPath = path.join(process.cwd(), "src", "data", "notion-data.json");
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        console.log("Successfully fetched Notion data to src/data/notion-data.json!");
    } catch (e) {
        console.error("Failed saving Notion data:", e);
        process.exit(1);
    }
}

main();
