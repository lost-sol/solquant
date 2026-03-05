import Image from "next/image";
import Link from "next/link";
import { getLiveRoadmap, getWikiArticles } from "@/lib/notion";


export default async function Home() {
    const [roadmapItemsRaw, wikiArticles] = await Promise.all([
        getLiveRoadmap(),
        getWikiArticles()
    ]);

    // Mock fallback if Notion API is not configured or fails
    const mockRoadmap = [
        { id: "1", title: "Updating Liquidation Heatmap to Pine Script V6", status: "In Progress", imageUrl: "/images/screenshots/screenshot1.png" },
        { id: "2", title: "Testing Max Pain Algorithm (Python Parity Run)", status: "In Progress", imageUrl: "/images/screenshots/screenshot2.png" },
        { id: "3", title: "Grid Strategy Backtest Sweep", status: "In Progress", imageUrl: "/images/twitter-header.png" }
    ];

    const roadmapItems = roadmapItemsRaw.length > 0 ? roadmapItemsRaw : mockRoadmap;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-foreground">
            {/* Hero Section */}
            <section className="relative w-full px-6 py-32 flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="absolute inset-0 z-[-1] overflow-hidden opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505] z-10"></div>
                    <Image src="/images/twitter-header.png" alt="Hero Background" fill className="object-cover object-center grayscale mix-blend-screen" priority />
                </div>
                <h1 className="text-5xl md:text-7xl tracking-tighter relative z-10">
                    Stop Guessing. <br className="hidden md:block" />
                    <span className="text-solquant-gold">Start Seeing.</span>
                </h1>
                <p className="max-w-3xl text-lg md:text-xl text-gray-400">
                    Most TradingView indicators lag behind the price. We build tools that show you the market’s true skeleton—the volume and leverage that actually move the needle before the candle even closes.
                </p>
                <div className="mt-8">
                    <Link
                        href="https://whop.com/solquant"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-solquant-gold border border-transparent rounded-2xl hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-solquant-gold"
                    >
                        Unlock the Edge
                    </Link>
                </div>
            </section>

            {/* Who We Are */}
            <section className="w-full max-w-4xl px-6 py-16 text-center">
                <h2 className="text-3xl font-bold mb-8">Who We Are</h2>
                <div className="py-8 px-4 border-t border-b border-solquant-gold/20">
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base max-w-3xl mx-auto">
                        We’re systems architects, not hedge fund bros. SolQuant was born because retail technical analysis is often broken. We build high-precision tools for traders who are tired of basic RSI and want to see the market's 'wireframe' — the hidden structure of volume and time that dictates where price goes next.
                    </p>
                </div>
            </section>


            {/* Product Suites */}
            <section className="w-full max-w-6xl px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">The Product Suites</h2>
                    <p className="mt-4 text-gray-400">Decode market mechanics with precision tools.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Suite A */}
                    <div className="bg-[#0a0a0a] p-8 flex flex-col justify-between transition-all duration-300 group rounded-2xl gold-glow">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold">The Liquidation Specialist</h3>
                                <span className="text-solquant-gold font-bold">$39.99/mo</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Focus on liquidity using the Liquidation Levels heatmap. Stop being the exit liquidity and start trading alongside institutional footprint.
                            </p>
                            <div className="relative w-full h-48 mb-6 rounded-2xl overflow-hidden border border-white/10 opacity-80 hover:opacity-100 transition-opacity">
                                <Image src="/images/liquidation.jpg" alt="Liquidation Specialist" fill className="object-cover" />
                            </div>
                        </div>
                        <Link
                            href="https://whop.com/solquant"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative inline-flex w-full items-center justify-center px-8 py-3 font-bold text-black transition-all duration-200 bg-solquant-gold border border-transparent rounded-2xl hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-solquant-gold mt-6 uppercase tracking-wide"
                        >
                            Unlock
                        </Link>
                    </div>

                    {/* Suite B */}
                    <div className="bg-[#0a0a0a] p-8 flex flex-col justify-between transition-all duration-300 group rounded-2xl gold-glow">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold">Precision Scalper Toolkit</h3>
                                <span className="text-solquant-gold font-bold">$34.99/mo</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Master the MTF Trend tools and the Synthetic Max Pain model. For traders operating on low timeframes extracting edge from volatility.
                            </p>
                            <div className="relative w-full h-48 mb-6 rounded-2xl overflow-hidden border border-white/10 opacity-80 hover:opacity-100 transition-opacity">
                                <Image src="/images/scalper.jpg" alt="Precision Scalper" fill className="object-cover" />
                            </div>
                        </div>
                        <Link
                            href="https://whop.com/solquant"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative inline-flex w-full items-center justify-center px-8 py-3 font-bold text-black transition-all duration-200 bg-solquant-gold border border-transparent rounded-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-solquant-gold mt-6 uppercase tracking-wide"
                        >
                            Unlock
                        </Link>
                    </div>
                </div>
            </section>

            {/* The Development Lab (formerly Active Development) */}
            <section className="w-full max-w-6xl px-6 py-12">
                <div className="p-4 md:p-8 rounded-2xl">
                    <div className="flex flex-col mb-8 border-b border-border pb-4">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-2xl font-bold">The Development Lab:</h2>
                            <span className="flex items-center text-xs text-solquant-gold animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-solquant-gold mr-2"></span>
                                LIVE SYNC
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            SolQuant is always evolving. Here’s a live look at the indicators we’re currently polishing and the new tools we’re dreaming up.
                        </p>
                    </div>
                    <div className="relative space-y-12">
                        {/* Vertical Timeline Line */}
                        <div className="absolute left-0 md:left-4 top-4 bottom-4 w-px bg-gradient-to-b from-solquant-gold/50 via-border/30 to-transparent"></div>

                        {roadmapItems.map((item: any) => {
                            const dateObj = item.date ? new Date(item.date) : null;
                            const formattedDate = dateObj ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

                            return (
                                <div key={item.id} className="relative pl-8 md:pl-16 group">
                                    {/* Timeline Node */}
                                    <div className="absolute left-[-4px] md:left-[12px] top-6 w-2 h-2 rounded-full bg-solquant-gold shadow-[0_0_10px_rgba(212,175,55,0.8)] border border-black z-10 group-hover:scale-125 transition-transform"></div>

                                    <div className="flex flex-col p-6 bg-[#0a0a0a] border border-white/5 hover:border-solquant-gold/30 transition-all duration-300 gap-4 rounded-2xl group-hover:bg-[#111111] shadow-xl">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-xl text-white group-hover:text-solquant-gold transition-colors">{item.title}</span>
                                                {formattedDate && (
                                                    <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                                                        {formattedDate}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-bold text-solquant-gold bg-solquant-gold/10 px-2 py-0.5 border border-solquant-gold/20 whitespace-nowrap w-fit rounded uppercase tracking-tighter self-start md:self-center">
                                                {item.status}
                                            </span>
                                        </div>
                                        {item.description && (
                                            <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                                        )}
                                        {(item.imageUrl && item.imageUrl !== '/images/logo.png') && (
                                            <div className="relative w-full rounded-xl overflow-hidden border border-white/10 mt-2 bg-black shadow-inner">
                                                <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Community Library */}
            <section className="w-full max-w-6xl px-6 py-12 mb-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">The Community Library</h2>
                    <p className="max-w-2xl mx-auto text-gray-400">
                        Start with our free "Lite" tools to understand the SolQuant edge before stepping into the Inner Circle.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                    {wikiArticles.filter((a: any) => a.tags?.includes('Community') || a.category?.includes('Community')).map((article: any) => (
                        <Link key={article.id} href={`/docs/${article.slug}`} className="group bg-[#0a0a0a] border border-white/5 p-4 hover:border-solquant-gold/50 transition-all duration-300 block rounded-2xl">
                            <div className="relative w-full h-32 mb-4 rounded-xl overflow-hidden border border-white/10 opacity-70 group-hover:opacity-100 transition-opacity">
                                <img src={article.screenshotUrl || article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                            </div>
                            <h4 className="font-mono font-bold text-center text-sm group-hover:text-solquant-gold transition-colors">{article.title}</h4>
                        </Link>
                    ))}
                </div>
                <div className="text-center">
                    <Link
                        href="/docs"
                        className="inline-flex items-center justify-center px-8 py-4 border border-border hover:bg-white/5 transition-colors text-sm uppercase tracking-wide rounded-2xl"
                    >
                        Explore Free Indicators
                    </Link>
                </div>
            </section>
        </div>
    );
}
