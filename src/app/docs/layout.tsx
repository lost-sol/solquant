import Link from "next/link";
import { getWikiArticles } from "@/lib/notion";
import SidebarLink from "@/components/SidebarLink";

export const revalidate = 60; // ISR

export default async function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const articlesRaw = await getWikiArticles();

    // Mock fallback
    const mockArticles = [
        { id: "1", title: "PVSRA Volume Integration", slug: "pvsra-volume", category: "Lite Tools" },
        { id: "2", title: "Liquidation Levels Heatmap", slug: "liquidation-levels", category: "Pro Tools" },
        { id: "3", title: "Synthetic Max Pain", slug: "synthetic-max-pain", category: "Pro Tools" },
    ];

    const articles = articlesRaw.length > 0 ? articlesRaw : mockArticles;

    // Group by category (handles multiple categories per article)
    const categories: Record<string, any[]> = {};
    articles.forEach((article: any) => {
        const itemCategories = article.categories || [article.category || "General"];
        itemCategories.forEach((cat: string) => {
            if (!categories[cat]) categories[cat] = [];

            // Check if already added to this category to avoid duplicates
            if (!categories[cat].some(item => item.id === article.id)) {
                categories[cat].push(article);
            }
        });
    });

    return (
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
            {/* Sidebar Desktop */}
            <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
                <div>
                    <h3 className="font-bold text-lg mb-4 wireframe-text">Documentation</h3>
                    <nav className="space-y-6">
                        {Object.entries(categories).map(([category, items]: [string, any]) => (
                            <div key={category}>
                                <h4 className="font-mono text-sm text-gray-500 mb-2 uppercase tracking-wide">{category}</h4>
                                <ul className="space-y-2">
                                    {items.map((item: any) => (
                                        <li key={item.id}>
                                            <SidebarLink
                                                href={`/docs/${item.slug}`}
                                            >
                                                {item.title}
                                            </SidebarLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Sticky CTA */}
                <div className="sticky top-24">
                    <div className="wireframe-box p-6 bg-[#050505]">
                        <h4 className="font-bold text-solquant-gold mb-2">Unlock Pro Tools</h4>
                        <p className="text-xs text-gray-400 font-mono mb-4">
                            Get full access to the SolQuant suite, including Liquidation Heatmaps and Max Pain models.
                        </p>
                        <Link
                            href="https://whop.com/solquant"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center py-2 bg-solquant-gold text-white font-bold text-sm tracking-wide hover:bg-yellow-600 transition-colors"
                        >
                            Unlock
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-4xl min-w-0">
                {children}
            </main>
        </div>
    );
}
