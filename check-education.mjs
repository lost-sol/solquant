import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const EDUCATION_PAGE_ID = process.env.NOTION_EDUCATION_PAGE_ID;

async function checkEducation() {
    console.log("Checking Education Page Access...");
    console.log("ID:", EDUCATION_PAGE_ID);

    try {
        const page = await notion.pages.retrieve({ page_id: EDUCATION_PAGE_ID });
        console.log("Main Page Title:", page.properties.title?.title[0]?.plain_text || "Untitled");

        console.log("\nFetching Children (Blocks)...");
        const blocks = await notion.blocks.children.list({ block_id: EDUCATION_PAGE_ID });
        const subPages = blocks.results.filter(b => b.type === 'child_page');
        console.log(`Found ${subPages.length} child pages:`);
        
        for (const subPage of subPages) {
            console.log(` - [${subPage.id}] ${subPage.child_page.title}`);
        }

        if (subPages.length === 0) {
            console.warn("\nWARNING: No child pages found. The education section will be empty on the site.");
            console.log("Full block list types found:", blocks.results.map(b => b.type));
        }

    } catch (error) {
        console.error("Error checking education:", error.message);
        if (error.body) {
            console.error("Notion Error Details:", error.body);
        }
    }
}

checkEducation();
