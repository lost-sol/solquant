import { Client } from "@notionhq/client";
import fs from "fs";
import path from "path";

// Initialize the Notion client
export const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

import notionData from '@/data/notion-data.json';

// Helper to fetch roadmap items
export async function getLiveRoadmap() {
    return notionData.roadmap || [];
}

// Helper to fetch wiki articles
export async function getWikiArticles() {
    return notionData.wiki || [];
}

// Helper to fetch education articles
export async function getEducationArticles() {
    return (notionData as any).education || [];
}

// Helper to fetch a single page content, including nested blocks
export async function getPageContent(pageId: string) {
    const wikiArticle = notionData.wiki.find((a: any) => a.id === pageId);
    if (wikiArticle) return wikiArticle.blocks;
    
    const educationArticle = (notionData as any).education?.find((a: any) => a.id === pageId);
    if (educationArticle) return educationArticle.blocks;
    
    return [];
}
