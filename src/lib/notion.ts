import { Client } from "@notionhq/client";
import fs from "fs";
import path from "path";

// Initialize the Notion client
export const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

import notionData from '@/data/notion-data.json';

// Helper to fetch roadmap items
export async function getRoadmap() {
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

// Helper to fetch policy pages
export async function getPolicies() {
    return (notionData as any).policies || [];
}

// Helper to fetch strategies
export async function getStrategies() {
    return (notionData as any).strategies || [];
}

// Helper to fetch explorer strategies
export async function getExplorerStrategies() {
    return (notionData as any).explorer_strategies || [];
}

// Helper to fetch a single page content, including nested blocks
export async function getPageContent(pageId: string) {
    const wikiArticle = notionData.wiki.find((a: any) => a.id === pageId);
    if (wikiArticle) return wikiArticle.blocks;
    
    const educationArticle = (notionData as any).education?.find((a: any) => a.id === pageId);
    if (educationArticle) return educationArticle.blocks;
    
    const policyPage = (notionData as any).policies?.find((a: any) => a.id === pageId);
    if (policyPage) return policyPage.blocks;

    const roadmapItem = (notionData.roadmap as any)?.find((a: any) => a.id === pageId);
    if (roadmapItem) return roadmapItem.blocks;

    const strategy = (notionData as any).strategies?.find((a: any) => a.id === pageId);
    if (strategy) return strategy.blocks;
    
    return [];
}
