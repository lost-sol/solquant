import { getWikiArticles, getPageContent } from "@/lib/notion";
import NotionRenderer from "@/components/NotionRenderer";
import { notFound } from "next/navigation";


type Props = {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    const articles = await getWikiArticles();
    return articles.map((a: any) => ({
        slug: a.slug,
    }));
}

export default async function WikiArticlePage({ params }: Props) {
    const resolvedParams = await params;
    const articles = await getWikiArticles();

    // Find the Notion page ID for this slug
    const articleMeta = articles.find((a: any) => a.slug === resolvedParams.slug);

    if (!articleMeta) {
        if (resolvedParams.slug === "pvsra-volume") {
            // Mock fallback for standard articles if Notion isn't connected
            return (
                <div className="prose prose-invert max-w-none">
                    <h1 className="text-4xl tracking-tight mb-4">PVSRA Volume Integration</h1>
                    <p className="font-mono text-sm text-gray-500 mb-8 pb-4 border-b border-border">Fallback Mode - Configure Notion API</p>
                    <div className="p-6 bg-solquant-blue/10 border-l-4 border-solquant-blue flex items-start space-x-4 wireframe-box">
                        <span className="text-xl">💡</span>
                        <p className="text-gray-300">
                            Momentum is velocity, but Liquidity is gravity.
                        </p>
                    </div>
                    <p className="mt-6 text-gray-300 text-lg leading-relaxed">
                        Understand market mechanics by decoding volume spikes aligned with critical support/resistance.
                    </p>
                </div>
            )
        }

        // Otherwise 404
        notFound();
    }

    // Fetch from Notion
    const blocks = await getPageContent(articleMeta.id);

    return (
        <div className="prose prose-invert max-w-none">
            {articleMeta.screenshotUrl && (
                <div className="relative w-full aspect-video md:aspect-[21/9] mb-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                    <img
                        src={articleMeta.screenshotUrl}
                        alt={articleMeta.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                </div>
            )}

            <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="inline-flex items-center self-start px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-solquant-gold/10 text-solquant-gold border border-solquant-gold/20 uppercase tracking-widest mb-3">
                            {Array.isArray((articleMeta as any).categories) && (articleMeta as any).categories.length > 0
                                ? (articleMeta as any).categories.join(", ")
                                : (articleMeta as any).category || "General"}
                        </span>
                        <h1 className="text-4xl md:text-5xl tracking-tight mb-0">{articleMeta.title}</h1>
                    </div>

                    {articleMeta.indicatorUrl && (
                        <div className="flex flex-col gap-2">
                            {((articleMeta as any).categories?.some((c: string) => c.includes('Suite A')) || (articleMeta as any).categories?.some((c: string) => c.includes('Suite B'))) && (
                                <a
                                    href={(articleMeta as any).categories?.some((c: string) => c.includes('Suite A')) 
                                        ? "https://whop.com/checkout/plan_agr70Bot9uI3q" 
                                        : "https://whop.com/checkout/plan_aeREgPjnII4uE"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-4 py-3 bg-solquant-gold text-black rounded-2xl hover:bg-yellow-600 transition-all group/btn font-bold text-sm uppercase tracking-wide"
                                >
                                    Subscribe via Whop
                                </a>
                            )}
                            <a
                                href={articleMeta.indicatorUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-solquant-gold/10 border border-solquant-gold/30 rounded-lg text-solquant-gold hover:bg-solquant-gold/20 hover:border-solquant-gold transition-all font-mono text-sm mb-1"
                            >
                                <span className="mr-2">🔗</span> Open on TradingView
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <div className="h-px bg-border mb-8"></div>

            {/* Dynamic Content */}
            <NotionRenderer blocks={blocks} />
        </div>
    );
}
