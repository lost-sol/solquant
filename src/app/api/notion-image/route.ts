import { NextRequest, NextResponse } from "next/server";
import { notion } from "@/lib/notion";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get("type"); // 'block', 'page'
    const id = searchParams.get("id");
    const propName = searchParams.get("propName"); // e.g. 'Screenshot'

    if (!type || !id) {
        return new NextResponse("Missing type or id", { status: 400 });
    }

    try {
        let redirectUrl = null;

        if (type === "block") {
            const block: any = await notion.blocks.retrieve({ block_id: id });
            if (block.type === 'image') {
                redirectUrl = block.image?.file?.url || block.image?.external?.url;
            }
        } else if (type === "page") {
            const page: any = await notion.pages.retrieve({ page_id: id });
            if (propName) {
                const prop = page.properties[propName];
                if (prop?.type === 'files' && prop.files?.length > 0) {
                    redirectUrl = prop.files[0].file?.url || prop.files[0].external?.url;
                }
            } else {
                // Return cover or icon
                redirectUrl = page.cover?.file?.url || page.cover?.external?.url || page.icon?.file?.url || page.icon?.external?.url;
            }
        }

        if (redirectUrl) {
            // Add Cache-Control so the proxy isn't hit for every single view by the browser within 1 hour
            // Notion signed URLs expire typically after 1 hour (3600 seconds)
            const response = NextResponse.redirect(redirectUrl, 302);
            response.headers.set('Cache-Control', 'public, max-age=3000, s-maxage=3000');
            return response;
        }

        // Return a generic placeholder or 404
        return new NextResponse("Image not found", { status: 404 });
    } catch (error) {
        console.error("Notion proxy error:", error);
        return new NextResponse("Error fetching from Notion", { status: 500 });
    }
}
