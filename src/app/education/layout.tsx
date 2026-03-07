import Link from "next/link";
import { getEducationArticles } from "@/lib/notion";
import SidebarLink from "@/components/SidebarLink";

export const revalidate = 60; // ISR

export default async function EducationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const articles = await getEducationArticles();

    // Grouping by category (though Education pages might just be a flat list, we'll keep the structure for consistency)
    const categories: Record<string, any[]> = {};
    articles.forEach((article: any) => {
        const itemCategories = article.categories || ["Education"];
        itemCategories.forEach((cat: string) => {
            if (!categories[cat]) categories[cat] = [];
            if (!categories[cat].some(item => item.id === article.id)) {
                categories[cat].push(article);
            }
        });
    });

    return (
        <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
            {/* Sidebar Desktop */}
            <aside className="w-full md:w-64 flex-shrink-0">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-6 wireframe-text">Education</h1>
                    <nav className="space-y-1">
                        {Object.entries(categories).map(([category, items]: [string, any]) => (
                            <div key={category}>
                                {category.toLowerCase() !== "education" && (
                                    <h4 className="font-mono text-sm text-gray-500 mb-2 uppercase tracking-wide">{category}</h4>
                                )}
                                <ul className="space-y-1">
                                    {items.map((item: any) => (
                                        <li key={item.id}>
                                            <SidebarLink
                                                href={`/education/${item.slug}`}
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
                <div className="sticky top-24 -ml-1">
                    <div className="p-6 bg-[#050505] border border-solquant-gold/20 rounded-2xl">
                        <h4 className="font-bold text-solquant-gold mb-2 uppercase tracking-tighter text-sm">Unlock Pro Tools</h4>
                        <p className="text-xs text-gray-400 font-mono mb-6 leading-relaxed">
                            Get full access to the SolQuant suite, including Liquidation Heatmaps and Max Pain models.
                        </p>
                        <Link
                            href="https://whop.com/solquant"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-3 bg-solquant-gold text-black rounded-2xl hover:bg-yellow-600 transition-all text-center font-bold text-sm uppercase tracking-wide shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                        >
                            Subscribe via Whop
                        </Link>
                        <p className="mt-4 text-[10px] text-gray-500 font-mono leading-relaxed opacity-60">
                            By clicking, you will be redirected to our secure store on Whop. Your purchase is subject to our <Link href="/terms" className="underline hover:text-solquant-gold transition-colors">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-solquant-gold transition-colors">Privacy Policy</Link>.
                        </p>
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
