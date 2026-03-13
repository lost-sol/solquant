import { Client } from "@notionhq/client";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

// Import sharp for image processing
let sharp;
try {
    sharp = (await import('sharp')).default;
} catch (e) {
    console.warn("WARNING: sharp not found. Image processing will be skipped.");
}

async function processMetadataImage(inputBuffer, title, id, hookText = null, ctaText = null, stats = null) {
    if (!sharp) return inputBuffer;

    try {
        console.log(`Generating metadata image for: ${title}`);

        const width = 1200;
        const height = 630;
        const TEXT_LEFT = 70;
        const TEXT_MAX_W = 1020; // safe text area leaving right margin

        // ── Load Logo (strip white background) ───────────────────────────────
        const logoPath = path.join(process.cwd(), "public", "images", "logo.png");
        let logoOverlay = null;
        if (fs.existsSync(logoPath)) {
            // The logo PNG has a white background — remove it by converting
            // white/near-white pixels to transparent using raw pixel manipulation.
            logoOverlay = await sharp(logoPath)
                .resize({ height: 80 })
                .ensureAlpha()
                .raw()
                .toBuffer({ resolveWithObject: true })
                .then(({ data, info }) => {
                    const { width: w, height: h, channels } = info;
                    for (let i = 0; i < w * h; i++) {
                        const r = data[i * channels];
                        const g = data[i * channels + 1];
                        const b = data[i * channels + 2];
                        // Treat near-white pixels as transparent
                        if (r > 220 && g > 220 && b > 220) {
                            data[i * channels + 3] = 0;
                        }
                    }
                    return sharp(data, { raw: { width: w, height: h, channels } })
                        .png()
                        .toBuffer();
                });
        }

        // ── Text wrapping helpers ─────────────────────────────────────────────
        function estimateWidth(str, fontSize) {
            // Slightly conservative estimate for bold/black uppercase text
            return str.length * fontSize * 0.65;
        }

        function wrapText(rawText, maxWidth, startFontSize, minFontSize, maxLines, uppercase = true) {
            const text = uppercase ? rawText.toUpperCase() : rawText;
            const words = text.split(" ");
            for (let fs = startFontSize; fs >= minFontSize; fs -= 2) {
                const lines = [];
                let current = "";
                for (const word of words) {
                    const test = current ? `${current} ${word}` : word;
                    if (estimateWidth(test, fs) > maxWidth) {
                        if (current) lines.push(current);
                        current = word;
                    } else {
                        current = test;
                    }
                }
                if (current) lines.push(current);
                const allFit = lines.every(l => estimateWidth(l, fs) <= maxWidth + 10);
                if (lines.length <= maxLines && allFit) return { lines, fontSize: fs };
            }
            // Hard fallback: single truncated line at minFontSize
            const truncated = text.length > 70 ? text.substring(0, 68) + "..." : text;
            return { lines: [truncated], fontSize: minFontSize };
        }

        // ── Measure text blocks ───────────────────────────────────────────────
        const titleWrap = wrapText(title, TEXT_MAX_W, 68, 44, 2, true);
        const hookWrap  = hookText ? wrapText(hookText, TEXT_MAX_W, 26, 20, 2, false) : null;

        const tFS = titleWrap.fontSize;           // title font size
        const tLH = tFS * 1.18;                   // title line height
        const hFS = hookWrap ? hookWrap.fontSize : 0;
        const hLH = hFS * 1.35;                   // hook line height

        // ── Stack-height layout ───────────────────────────────────────────────
        // Stack top-to-bottom: [TITLE LINES] → [HOOK LINES] → [CTA button]
        // Anchored to a fixed distance from image bottom.

        // Use CTA text from database, fallback to 'View Now'
        const ctaLabel  = (ctaText && ctaText.trim().length > 0) ? ctaText.trim() : "View Now";
        const CTA_H     = 52;
        // Auto-size button width: ~14px per char at size-18 bold, plus 48px padding
        const CTA_W     = Math.max(180, Math.min(580, ctaLabel.length * 14 + 48));
        const GAP_HOOK  = 12;   // px between last title baseline and first hook baseline
        const GAP_CTA   = 18;   // px between last hook (or title) baseline and CTA top

        // Measure each layer height
        const titleH = titleWrap.lines.length * tLH;
        const hookH  = hookWrap ? hookWrap.lines.length * hLH : 0;
        const STATS_H = stats ? 85 : 0;
        const GAP_STATS = stats ? 28 : 0;
        const totalStackH = titleH + (hookH ? GAP_HOOK + hookH : 0) + (stats ? GAP_STATS + STATS_H : 0) + GAP_CTA + CTA_H;

        // Anchor bottom of stack 28px above image bottom
        const STACK_BOTTOM = height - 28;
        const STACK_TOP    = STACK_BOTTOM - totalStackH;

        // Title: first baseline
        const title1stBaseline = STACK_TOP + tFS;

        // Hook: first baseline = last title baseline + gap
        const hook1stBaseline = title1stBaseline + (titleWrap.lines.length - 1) * tLH + GAP_HOOK + hFS * 0.85;

        // CTA: anchored below last hook line (or last title line if no hook)
        const lastTextBaseline = hookWrap
            ? hook1stBaseline + (hookWrap.lines.length - 1) * hLH
            : title1stBaseline + (titleWrap.lines.length - 1) * tLH;
        
        // Stats: baseline if they exist
        const statsBaseY = stats ? lastTextBaseline + GAP_STATS + 18 : 0;
        
        const ctaTopY  = stats 
            ? statsBaseY + 40 + GAP_CTA 
            : lastTextBaseline + GAP_CTA;
        const ctaTextY = ctaTopY + CTA_H * 0.66;

        // ── Build SVG elements ────────────────────────────────────────────────
        const titleSVG = titleWrap.lines.map((line, i) => {
            const y = title1stBaseline + i * tLH;
            return `<text x="${TEXT_LEFT}" y="${y}" font-family="Arial Black, Arial, sans-serif" font-size="${tFS}" font-weight="900" fill="#FFFFFF" letter-spacing="-0.01em">${line}</text>`;
        }).join("\n");

        let hookSVG = "";
        if (hookWrap && hookWrap.lines.length > 0) {
            hookSVG = hookWrap.lines.map((line, i) => {
                const y = hook1stBaseline + i * hLH;
                return `<text x="${TEXT_LEFT}" y="${y}" font-family="Arial, sans-serif" font-size="${hFS}" font-weight="400" fill="rgba(255,255,255,0.78)" letter-spacing="0.01em">${line}</text>`;
            }).join("\n");
        }
        
        let statsSVG = "";
        if (stats) {
            const ret = stats.net_profit_pct !== undefined ? `${stats.net_profit_pct > 0 ? '+' : ''}${stats.net_profit_pct.toLocaleString(undefined, { maximumFractionDigits: 1 })}%` : "N/A";
            const dd = stats.max_drawdown_pct !== undefined ? `${Math.abs(stats.max_drawdown_pct).toLocaleString(undefined, { maximumFractionDigits: 1 })}%` : "N/A";
            const wr = stats.win_rate !== undefined ? `${stats.win_rate.toLocaleString(undefined, { maximumFractionDigits: 1 })}%` : "N/A";

            statsSVG = `
                <g transform="translate(${TEXT_LEFT}, ${statsBaseY})">
                    <text x="0" y="0" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="rgba(255,255,255,0.6)" letter-spacing="0.1em">RETURN</text>
                    <text x="0" y="42" font-family="Arial Black, Arial, sans-serif" font-size="42" font-weight="900" fill="#22c55e" letter-spacing="-0.02em">${ret}</text>
                    
                    <text x="350" y="0" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="rgba(255,255,255,0.6)" letter-spacing="0.1em">DRAWDOWN</text>
                    <text x="350" y="42" font-family="Arial Black, Arial, sans-serif" font-size="42" font-weight="900" fill="#ef4444" letter-spacing="-0.02em">${dd}</text>
                    
                    <text x="700" y="0" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="rgba(255,255,255,0.6)" letter-spacing="0.1em">WINRATE</text>
                    <text x="700" y="42" font-family="Arial Black, Arial, sans-serif" font-size="42" font-weight="900" fill="#D4AF37" letter-spacing="-0.02em">${wr}</text>
                </g>
            `;
        }

        const ctaSVG = `
            <rect x="${TEXT_LEFT}" y="${ctaTopY}" width="${CTA_W}" height="${CTA_H}" rx="8" fill="#D4AF37"/>
            <text x="${TEXT_LEFT + CTA_W / 2}" y="${ctaTextY}" font-family="Arial Black, Arial, sans-serif" font-size="18" font-weight="900" fill="#0a0a0a" text-anchor="middle" letter-spacing="0.04em">${ctaLabel}</text>
        `;

        const copyrightSVG = `<text x="${width - 70}" y="${height - 28}" font-family="Arial, sans-serif" font-size="16" font-weight="400" fill="rgba(255,255,255,0.5)" text-anchor="end" letter-spacing="0.05em">SOLQUANT.XYZ</text>`;

        const svgOverlay = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stop-color="#000" stop-opacity="0.45"/>
                    <stop offset="38%"  stop-color="#000" stop-opacity="0.65"/>
                    <stop offset="65%"  stop-color="#000" stop-opacity="0.88"/>
                    <stop offset="100%" stop-color="#000" stop-opacity="0.96"/>
                </linearGradient>
            </defs>
            <rect width="${width}" height="${height}" fill="url(#scrim)"/>

            ${titleSVG}
            ${hookSVG}
            ${statsSVG}
            ${ctaSVG}
            ${copyrightSVG}
        </svg>`;

        const compositeLayers = [
            { input: Buffer.from(svgOverlay), left: 0, top: 0 }
        ];

        // Logo: top-left corner of image
        if (logoOverlay) {
            compositeLayers.push({ input: logoOverlay, left: TEXT_LEFT, top: 36 });
        }

        const processedImage = await sharp(inputBuffer)
            .resize(width, height, { fit: 'cover', position: 'center' })
            .composite(compositeLayers)
            .jpeg({ quality: 90 })
            .toBuffer();

        return processedImage;
    } catch (e) {
        console.error(`Failed to process image: ${e.message}`);
        return inputBuffer;
    }
}



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

async function downloadAndCacheImage(url, id, folder = "notion", title = "SolQuant", headlineText = null, ctaText = null, generateOg = false, localSrcPath = null, stats = null) {
    if (!url && !localSrcPath) return { imageUrl: "/images/logo.png", ogImageUrl: "/images/logo.png" };
    try {
        const urlHash = crypto.createHash('md5').update((url || localSrcPath).split('?')[0]).digest('hex').substring(0, 8);
        const baseFileName = `${id}_${urlHash}`;
        const cleanFileName = `${baseFileName}.jpg`;
        const ogFileName = `${baseFileName}-og.jpg`;
        
        const cleanPath = path.join(publicDir, cleanFileName);
        const ogPath = path.join(publicDir, ogFileName);
        
        const publicCleanPath = `/images/${folder}/${cleanFileName}`;
        const publicOgPath = `/images/${folder}/${ogFileName}`;

        // Ensure directory exists
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        // Check if we need to download/process
        const cleanExists = fs.existsSync(cleanPath);
        const ogExists = fs.existsSync(ogPath);
        
        if (!cleanExists || (generateOg && !ogExists) || (generateOg && sharp)) {
            // If clean is missing, download. If OG is missing AND generateOg is true, download.
            // If sharp is available AND generateOg is true, we ALWAYS re-process the OG image to ensure logic/branding is current.
            
            let originalBuffer;
            if (url && (!cleanExists || (generateOg && !ogExists))) {
                console.log(`Downloading${generateOg ? " and branding" : ""} image: ${id}`);
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
                const arrayBuffer = await response.arrayBuffer();
                originalBuffer = Buffer.from(arrayBuffer);
            } else if (localSrcPath && (!cleanExists || (generateOg && !ogExists))) {
                console.log(`Branding local source image: ${id}`);
                originalBuffer = fs.readFileSync(localSrcPath);
            } else if (cleanExists) {
                // If cleanExists, we can use the existing clean file as the source for branding if we just need to re-brand
                originalBuffer = fs.readFileSync(cleanPath);
            } else {
                return { imageUrl: "/images/logo.png", ogImageUrl: "/images/logo.png" };
            }

            // 1. Save clean version if it doesn't exist
            if (!cleanExists) {
                if (sharp) {
                    await sharp(originalBuffer)
                        .jpeg({ quality: 90 })
                        .toFile(cleanPath);
                } else {
                    fs.writeFileSync(cleanPath, originalBuffer);
                }
            }

            // 2. Generate and save branded OG version if requested
            if (generateOg) {
                if (sharp) {
                    console.log(`  Branding OG image: ${ogFileName}`);
                    const ogBuffer = await processMetadataImage(originalBuffer, title, id, headlineText, ctaText, stats);
                    fs.writeFileSync(ogPath, ogBuffer);
                } else if (!ogExists) {
                    // Fallback to copy clean if sharp unavailable and OG doesn't exist
                    fs.copyFileSync(cleanPath, ogPath);
                }
            }
        }

        return {
            imageUrl: publicCleanPath,
            ogImageUrl: generateOg ? publicOgPath : publicCleanPath
        };
    } catch (e) {
        console.error(`Failed to download image ${url}`, e);
        return { imageUrl: "/images/logo.png", ogImageUrl: "/images/logo.png" };
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
                const { imageUrl: localPath } = await downloadAndCacheImage(imageUrl, block.id, "notion");
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
        const previewResults = await Promise.all(
            previewImages.map((url, idx) => downloadAndCacheImage(url, `${page.id}_preview_${idx}`, "notion", item.title, null, null, true))
        );

        item.previewImageUrls = previewResults.map(r => r.imageUrl);
        item.previewOgImageUrls = previewResults.map(r => r.ogImageUrl);

        // Set the primary imageUrl for backward compatibility/summary
        if (item.previewImageUrls.length > 0) {
            item.imageUrl = item.previewImageUrls[0];
            item.ogImageUrl = item.previewOgImageUrls[0];
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
        const hook = page.properties['Hook']?.rich_text[0]?.plain_text;
        const cta = page.properties['CTA']?.rich_text[0]?.plain_text;
        
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
            hook: hook,
            cta: cta,
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
            const { imageUrl: cleanUrl, ogImageUrl } = await downloadAndCacheImage(imageUrl, page.id, "notion", item.title, hook, cta, true);
            item.imageUrl = cleanUrl;
            item.ogImageUrl = ogImageUrl;
        }

        if (rawScreenshotUrl) {
            const { imageUrl: cleanUrl, ogImageUrl } = await downloadAndCacheImage(rawScreenshotUrl, `${page.id}_screenshot`, "notion", item.title, hook, cta, true);
            item.screenshotUrl = cleanUrl;
            item.screenshotOgUrl = ogImageUrl;
            // If we have a screenshot, it often makes a better OG image
            item.ogImageUrl = ogImageUrl;
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
    const subPages = results.filter(block => block.type === 'child_page' && !block.archived && !block.in_trash);

    console.log(`Found ${subPages.length} active child pages in Education.`);

    const items = (await Promise.all(subPages.map(async (pageBlock) => {
        const pageId = pageBlock.id;
        const pageTitle = pageBlock.child_page.title;
        const slug = pageTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        try {
            console.log(`  - Fetching education page: ${pageTitle} (${pageId})`);
            
            // Fetch the full page object to get cover/icon
            const page = await notion.pages.retrieve({ page_id: pageId });

            const item = {
                id: pageId,
                title: pageTitle,
                slug: slug,
                categories: ["Education"],
                summary: "", // Will extract from blocks
                imageUrl: "/images/logo.png",
                hook: page.properties.Hook?.rich_text[0]?.plain_text || "",
                cta: page.properties.CTA?.rich_text[0]?.plain_text || "",
                blocks: []
            };

            // Get Blocks
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
                const { imageUrl: cleanUrl, ogImageUrl } = await downloadAndCacheImage(imageUrl, pageId, "notion", item.title, item.hook, item.cta, true);
                item.imageUrl = cleanUrl;
                item.ogImageUrl = ogImageUrl;
            }

            return item;
        } catch (e) {
            console.error(`  FAILED to fetch education page "${pageTitle}":`, e.message);
            return null;
        }
    }))).filter(item => item !== null);

    console.log(`Successfully processed ${items.length} education articles.`);
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
            categories: ["Policy"],
            summary: "",
            imageUrl: "/images/logo.png",
            hook: page.properties.Hook?.rich_text[0]?.plain_text || "",
            cta: page.properties.CTA?.rich_text[0]?.plain_text || "",
            blocks: []
        };

        // Get Blocks
        console.log(`Fetching blocks for policy page: ${pageTitle}`);
        item.blocks = await fetchNotionBlocks(pageId);

        // Scan blocks for local images
        await replaceImageBlocksWithLocalPaths(item.blocks);

        // Fetch Cover Image
        let imageUrl = page.cover?.external?.url || page.cover?.file?.url;
        if (!imageUrl) {
            const imageBlock = item.blocks.find((b) => b.type === "image");
            if (imageBlock) {
                imageUrl = imageBlock.image?.external?.url || imageBlock.image?.file?.url;
            }
        }

        if (imageUrl) {
            const { imageUrl: cleanUrl, ogImageUrl } = await downloadAndCacheImage(imageUrl, page.id, "notion", pageTitle, item.hook, item.cta, true);
            item.imageUrl = cleanUrl;
            item.ogImageUrl = ogImageUrl;
        }

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
        const hook = page.properties['Hook']?.rich_text[0]?.plain_text;
        const cta = page.properties['CTA']?.rich_text[0]?.plain_text;
        
        const item = {
            id: page.id,
            title: title,
            slug: slug,
            summary: page.properties['Description']?.rich_text[0]?.plain_text || page.properties['Core Concept']?.rich_text[0]?.plain_text || "",
            imageUrl: "/images/logo.png",
            hook: hook,
            cta: cta,
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
            const { imageUrl: cleanUrl, ogImageUrl } = await downloadAndCacheImage(imageUrl, page.id, "notion", item.title, hook, cta, true, null, item.stats);
            item.imageUrl = cleanUrl;
            item.ogImageUrl = ogImageUrl;
        }

        return item;
    }));
    return items;
}

async function buildExplorerStrategies(notionStrategies) {
    console.log("Building Explorer Strategy Metadata...");
    const manifestPath = path.join(process.cwd(), "src", "data", "backtest-explorer", "manifest.json");
    if (!fs.existsSync(manifestPath)) {
        console.warn("WARNING: manifest.json not found. Skipping explorer strategy metadata.");
        return [];
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const items = await Promise.all(manifest.strategies.map(async (strategy) => {
        // Find matching Notion strategy by name/title
        const match = notionStrategies.find(s => s.title.toLowerCase() === strategy.name.toLowerCase() || s.title.toLowerCase().includes(strategy.name.toLowerCase()));
        
        if (match) {
            return {
                id: strategy.id,
                name: strategy.name,
                ogImageUrl: match.ogImageUrl, // Reuse the one generated in buildStrategies if possible
                hook: match.hook || strategy.description,
                cta: match.cta || "View Now"
            };
        }

        // Pull stats for explorer strategies from their specific JSON files
        let explorerStats = null;
        try {
            const strategyDataPath = path.join(process.cwd(), "src", "data", "backtest-explorer", `${strategy.id}.json`);
            if (fs.existsSync(strategyDataPath)) {
                const strategyData = JSON.parse(fs.readFileSync(strategyDataPath, "utf-8"));
                const bestToken = strategy.best_token;
                // Find stats for the best token
                if (strategyData.best_params && strategyData.best_params[bestToken]) {
                    const metrics = strategyData.best_params[bestToken].metrics;
                    explorerStats = {
                        net_profit_pct: metrics.return_pct,
                        max_drawdown_pct: metrics.max_dd_pct,
                        win_rate: metrics.win_rate
                    };
                }
            }
        } catch (e) {
            console.error(`Failed to load stats for explorer strategy ${strategy.id}:`, e.message);
        }

        // If no match (e.g. Trend Exhaustion), generate a branded version using the default header
        console.log(`No Notion match for explorer strategy: ${strategy.name}. Generating branded fallback.`);
        const defaultPath = path.join(process.cwd(), "public", "images", "twitter-header.png");
        
        try {
            const { ogImageUrl } = await downloadAndCacheImage(
                null, 
                `explorer_${strategy.id}`, 
                "notion", 
                strategy.name, 
                strategy.description, 
                "View Backtest", 
                true, 
                defaultPath,
                explorerStats
            );
            
            return {
                id: strategy.id,
                name: strategy.name,
                ogImageUrl: ogImageUrl,
                hook: strategy.description,
                cta: "View Backtest"
            };
        } catch (e) {
            console.error(`Failed to generate fallback for ${strategy.name}:`, e.message);
            return {
                id: strategy.id,
                name: strategy.name,
                ogImageUrl: "/images/twitter-header.png",
                hook: strategy.description,
                cta: "View Backtest"
            };
        }
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
        explorer_strategies: [],
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
            data.explorer_strategies = await buildExplorerStrategies(data.strategies);
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
