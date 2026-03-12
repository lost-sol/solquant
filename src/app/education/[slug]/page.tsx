import type { Metadata } from "next";
import { getEducationArticles, getPageContent } from "@/lib/notion";
import NotionRenderer from "@/components/NotionRenderer";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const articles = await getEducationArticles();
    const articleMeta = articles.find((a: any) => a.slug === resolvedParams.slug);

    if (!articleMeta) {
        return {};
    }

    const title = `${articleMeta.title} | SolQuant Education`;
    
    // Robust description extraction
    let description = articleMeta.summary || "";
    if (!description && articleMeta.blocks) {
        const firstParagraph = articleMeta.blocks.find((block: any) => block.type === 'paragraph');
        if (firstParagraph?.paragraph?.rich_text) {
            description = firstParagraph.paragraph.rich_text
                .map((rt: any) => rt.plain_text)
                .join('')
                .substring(0, 160);
        }
    }

    if (!description) {
        description = "Master technical analysis with SolQuant Education. Professional trading best practices and indicator mechanics.";
    }

    const ogImageUrl = (articleMeta as any).ogImageUrl || articleMeta.imageUrl || "/images/twitter-header.png";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "article",
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: articleMeta.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImageUrl],
        },
    };
}

export async function generateStaticParams() {
    const articles = await getEducationArticles();
    return articles.map((a: any) => ({
        slug: a.slug,
    }));
}

export default async function EducationArticlePage({ params }: Props) {
    const resolvedParams = await params;
    const articles = await getEducationArticles();

    // Find the Notion page ID for this slug
    const articleMeta = articles.find((a: any) => a.slug === resolvedParams.slug);

    if (!articleMeta) {
        notFound();
    }

    // Fetch blocks from Notion payload (already in notion-data.json)
    const blocks = await getPageContent(articleMeta.id);

    return (
        <div className="prose prose-invert max-w-none">
            {articleMeta.imageUrl && (
                <div className="relative w-full aspect-video md:aspect-[21/9] mb-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                    <img
                        src={articleMeta.imageUrl}
                        alt={articleMeta.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                </div>
            )}

            <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-col">
                    <span className="inline-flex items-center self-start px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-solquant-gold/10 text-solquant-gold border border-solquant-gold/20 uppercase tracking-widest mb-3">
                        Education
                    </span>
                    <h1 className="text-4xl md:text-5xl tracking-tight mb-0">{articleMeta.title}</h1>
                </div>
            </div>

            <div className="h-px bg-border mb-8"></div>

            {/* Dynamic Content */}
            <NotionRenderer blocks={blocks} />
        </div>
    );
}
