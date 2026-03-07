import Image from "next/image";
import Link from "next/link";
import { getLiveRoadmap, getWikiArticles } from "@/lib/notion";
import FAQ from "@/components/FAQ";

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
                <div className="mt-8 flex flex-col items-center">
                    <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden border border-solquant-gold/20 shadow-[0_0_50px_rgba(212,175,55,0.15)] mb-10 group">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                        >
                            <source src="/timelapse_2.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/40 via-transparent to-transparent pointer-events-none"></div>
                    </div>
                    <Link
                        href="https://whop.com/solquant"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center justify-center px-8 py-3.5 font-bold text-black transition-all duration-200 bg-solquant-gold border border-transparent rounded-2xl hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-solquant-gold uppercase tracking-wide text-sm"
                    >
                        Subscribe via Whop
                    </Link>
                    <p className="mt-4 text-xs text-gray-500 max-w-sm font-mono leading-relaxed">
                        By clicking, you will be redirected to our secure store on Whop. Your purchase is subject to our <Link href="/terms" className="underline hover:text-solquant-gold transition-colors">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-solquant-gold transition-colors">Privacy Policy</Link>.
                    </p>
                </div>
            </section>

            {/* Who We Are */}
            <section className="w-full max-w-4xl px-6 py-16 text-center">
                <h2 className="text-3xl font-bold mb-8">Who We Are</h2>
                <div className="py-8 px-4 border-t border-b border-solquant-gold/20">
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base max-w-3xl mx-auto">
                        We’re systems architects, not hedge fund bros. SolQuant was born because retail technical analysis is often broken. We build high-precision tools for traders who are tired of basic RSI and want to see the market's 'wireframe' — the hidden structure of volume and time that dictates where price goes next. <Link href="/about" className="text-solquant-gold hover:text-yellow-600 transition-colors font-bold ml-1">more...</Link>
                    </p>
                </div>
            </section>


            {/* Product Suites */}
            <section className="w-full max-w-7xl px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">The Product Suites</h2>
                    <p className="mt-4 text-gray-400">Decode market mechanics with precision tools.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Suite A */}
                    <div className="bg-[#0a0a0a] p-8 flex flex-col justify-between transition-all duration-300 group rounded-2xl gold-glow border border-white/5">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold">The Liquidation Specialist</h3>
                                <span className="text-solquant-gold font-bold text-lg">$39.99/mo</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Focus on liquidity using the Liquidation Levels heatmap. Stop being the exit liquidity and start trading alongside institutional footprint.
                            </p>
                            <div className="relative w-full h-56 mb-6 rounded-2xl overflow-hidden border border-white/10 opacity-90 group-hover:opacity-100 transition-opacity">
                                <Image src="/images/liquidation.jpg" alt="Liquidation Specialist" fill className="object-cover" />
                            </div>

                            <div className="space-y-3 mb-6">
                                <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Included Indicators</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {wikiArticles.filter((a: any) => a.categories?.some((c: string) => c.includes('Suite A'))).map((article: any) => (
                                        <Link
                                            key={article.id}
                                            href={`/docs/${article.slug}`}
                                            className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-solquant-gold/20 hover:border-solquant-gold/50 transition-all duration-300 group/item"
                                        >
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                                                <Image
                                                    src={article.screenshotUrl || article.imageUrl || '/images/logo.png'}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-300 group-hover/item:text-solquant-gold transition-colors">{article.title}</span>
                                            <svg className="w-3.5 h-3.5 ml-auto text-gray-600 group-hover/item:text-solquant-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center w-full">
                            <Link
                                href="https://whop.com/solquant"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative inline-flex w-full items-center justify-center px-8 py-3.5 font-bold text-black transition-all duration-200 bg-solquant-gold border border-transparent rounded-2xl hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-solquant-gold mt-2 uppercase tracking-wide text-sm"
                            >
                                Subscribe via Whop
                            </Link>
                            <p className="mt-2 text-[11px] text-gray-500 font-mono leading-relaxed text-center">
                                By clicking, you will be redirected to our secure store on Whop. Your purchase is subject to our <Link href="/terms" className="underline hover:text-solquant-gold transition-colors">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-solquant-gold transition-colors">Privacy Policy</Link>.
                            </p>
                        </div>
                    </div>

                    {/* Suite B */}
                    <div className="bg-[#0a0a0a] p-8 flex flex-col justify-between transition-all duration-300 group rounded-2xl gold-glow border border-white/5">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold">Precision Scalper Toolkit</h3>
                                <span className="text-solquant-gold font-bold text-lg">$34.99/mo</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Master the MTF Trend tools and the Synthetic Max Pain model. For traders operating on low timeframes extracting edge from volatility.
                            </p>
                            <div className="relative w-full h-56 mb-6 rounded-2xl overflow-hidden border border-white/10 opacity-90 group-hover:opacity-100 transition-opacity">
                                <Image src="/images/scalper.jpg" alt="Precision Scalper" fill className="object-cover" />
                            </div>

                            <div className="space-y-3 mb-6">
                                <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Included Indicators</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {wikiArticles.filter((a: any) => a.categories?.some((c: string) => c.includes('Suite B'))).map((article: any) => (
                                        <Link
                                            key={article.id}
                                            href={`/docs/${article.slug}`}
                                            className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-solquant-gold/20 hover:border-solquant-gold/50 transition-all duration-300 group/item"
                                        >
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                                                <Image
                                                    src={article.screenshotUrl || article.imageUrl || '/images/logo.png'}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-300 group-hover/item:text-solquant-gold transition-colors">{article.title}</span>
                                            <svg className="w-3.5 h-3.5 ml-auto text-gray-600 group-hover/item:text-solquant-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center w-full">
                            <Link
                                href="https://whop.com/solquant"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative inline-flex w-full items-center justify-center px-8 py-3.5 font-bold text-black transition-all duration-200 bg-solquant-gold border border-transparent rounded-2xl hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-solquant-gold mt-2 uppercase tracking-wide text-sm"
                            >
                                Subscribe via Whop
                            </Link>
                            <p className="mt-2 text-[9px] text-gray-500 font-mono leading-relaxed text-center">
                                By clicking, you will be redirected to our secure store on Whop. Your purchase is subject to our <Link href="/terms" className="underline hover:text-solquant-gold transition-colors">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-solquant-gold transition-colors">Privacy Policy</Link>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Development Lab (formerly Active Development) */}
            <section className="w-full max-w-[1920px] px-6 md:px-12 py-12">
                <div className="p-4 md:p-8 rounded-2xl">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">The Development Lab</h2>
                            <span className="flex items-center text-[10px] font-bold text-solquant-gold bg-solquant-gold/10 px-2 py-0.5 border border-solquant-gold/20 rounded uppercase tracking-tighter animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-solquant-gold mr-1.5 shadow-[0_0_8px_rgba(212,175,55,0.6)]"></span>
                                LIVE SYNC
                            </span>
                        </div>
                        <p className="text-gray-400">
                            SolQuant is always evolving. Here’s a live look at the indicators we’re currently polishing and the new tools we’re dreaming up.
                        </p>
                    </div>

                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 lg:gap-8">
                        {roadmapItems.map((item: any) => {
                            let formattedDate = "";
                            if (item.date) {
                                const [year, month, day] = item.date.split('-').map(Number);
                                const dateObj = new Date(year, month - 1, day);
                                formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                            }

                            return (
                                <div key={item.id} className="break-inside-avoid mb-6 lg:mb-8 group">
                                    <div className="flex flex-col p-6 bg-[#0a0a0a] border border-white/5 hover:border-solquant-gold/30 transition-all duration-300 gap-4 rounded-2xl group-hover:bg-[#111111] shadow-xl hover:scale-[1.02]">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <span className="font-bold text-xl text-white group-hover:text-solquant-gold transition-colors leading-tight">{item.title}</span>
                                                <span className="text-[10px] font-bold text-solquant-gold bg-solquant-gold/10 px-2 py-0.5 border border-solquant-gold/20 whitespace-nowrap rounded uppercase tracking-tighter flex-shrink-0">
                                                    {item.status}
                                                </span>
                                            </div>
                                            {formattedDate && (
                                                <span className="text-xs text-gray-500 uppercase tracking-widest">
                                                    {formattedDate}
                                                </span>
                                            )}
                                        </div>

                                        {item.description && (
                                            <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                                        )}

                                        {(item.imageUrl && item.imageUrl !== '/images/logo.png') && (
                                            <div className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-black shadow-inner">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                                />
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
                    {wikiArticles.filter((a: any) => a.categories?.includes('Community')).map((article: any) => (
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

            {/* FAQ Section */}
            <FAQ />
        </div>
    );
}
