import type { Metadata } from "next";
import Link from "next/link";
import { getWikiArticles } from "@/lib/notion";

export const metadata: Metadata = {
    title: "SolQuant Indicators | Documentation",
    description: "Welcome to the technical authority hub. Decode market mechanics with our high-precision technical analysis tools.",
};

export default async function DocsPage() {
    const articles = await getWikiArticles();

    return (
        <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl tracking-tight mb-4">SolQuant Indicators</h1>
            <p className="text-xl text-gray-400 font-mono mb-8">
                Welcome to the technical authority hub. We decode market mechanics before we explain settings.
            </p>

            <div className="py-6 my-8 border-l-2 border-solquant-gold pl-6">
                <h2 className="text-2xl font-bold mb-2">Our Philosophy</h2>
                <p className="text-gray-300">
                    "Momentum is velocity, but Liquidity is gravity." We focus on institutional footprint,
                    whale traps, and the hidden structure of volume. Please select a topic from the sidebar
                    to dive deep into the specific algorithms and indicators that power the SolQuant edge.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {articles.map((article: any) => {
                    const itemCategories = article.categories || [article.category || "General"];
                    const isPrecision = itemCategories.some((cat: string) => cat.includes('Precision'));
                    const isLiquidation = itemCategories.some((cat: string) => cat.includes('Liquidation'));
                    const pillColor = isPrecision
                        ? 'bg-[#6b4785] text-white'
                        : isLiquidation
                            ? 'bg-[#987a38] text-white'
                            : 'bg-white/10 text-gray-300';

                    return (
                        <Link key={article.id} href={`/docs/${article.slug}`} className="group flex flex-col bg-[#141414] hover:bg-[#1a1a1a] border border-white/5 rounded-lg overflow-hidden transition-all duration-300">
                            {(article.screenshotUrl || article.imageUrl) && (
                                <div className="w-full h-40 bg-black relative border-b border-white/5 overflow-hidden">
                                    <img src={article.screenshotUrl || article.imageUrl} alt={article.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                </div>
                            )}
                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="font-bold text-lg text-white flex items-center mb-2 group-hover:text-[#e0a82e] transition-colors">
                                    <span className="text-[#e0a82e] mr-2">📈</span> {article.title}
                                </h3>
                                <p className="text-sm font-mono text-gray-400 mb-4 flex-grow leading-relaxed line-clamp-2">
                                    {article.summary || "Select to view detailed mechanics and configuration."}
                                </p>
                                <span className={`text-xs font-mono px-2 py-1 rounded self-start ${pillColor}`}>
                                    {itemCategories.join(", ")}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
