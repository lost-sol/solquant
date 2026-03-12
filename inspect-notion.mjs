import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const STRATEGIES_DATABASE_ID = process.env.NOTION_STRATEGY_DATABASE_ID;

async function inspect() {
    console.log("Using Strategy Database ID:", STRATEGIES_DATABASE_ID);
    try {
        const response = await notion.databases.retrieve({ database_id: STRATEGIES_DATABASE_ID });
        console.log("Database Response:", JSON.stringify(response, null, 2));
        if (response.properties) {
            console.log("Database Properties:");
            console.log(JSON.stringify(Object.keys(response.properties), null, 2));
        }
        
        console.log("\nNotion databases methods:", Object.keys(notion.databases));

        console.log("\nQuerying database...");
        const query = await notion.databases.query({ database_id: STRATEGIES_DATABASE_ID, page_size: 1 });
        if (query.results.length > 0) {
            console.log("\nSample Page Properties Names:");
            const page = query.results[0];
            console.log(JSON.stringify(Object.keys(page.properties), null, 2));
            
            console.log("\nSample Page Properties Values:");
            for (const key of Object.keys(page.properties)) {
                console.log(`${key}:`, JSON.stringify(page.properties[key], null, 2));
            }
        } else {
            console.log("No results found in database query.");
        }
    } catch (error) {
        console.error("Error inspecting database:", error);
    }
}

inspect();
