import Image from "next/image";
import Link from "next/link";
import { getRoadmap, getWikiArticles, getEducationArticles, getStrategies } from "@/lib/notion";
import FAQ from "@/components/FAQ";

export default async function Home() {
    const [roadmapItems, wikiArticles, strategies] = await Promise.all([
        getRoadmap(),
        getWikiArticles(),
        getStrategies()
    ]);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-foreground">
            {/* Hero Section */}
            <section className="relative w-full px-6 py-32 flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="absolute inset-0 z-[-1] overflow-hidden opacity-30 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/60 to-[#050505] z-10"></div>
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover grayscale mix-blend-screen"
                    >
                        <source src="/timelapse_2.mp4" type="video/mp4" />
                    </video>
                </div>
                <h1 className="text-5xl md:text-7xl tracking-tighter relative z-10">
                    Stop Guessing. <br className="hidden md:block" />
                    <span className="text-solquant-gold">Start Seeing.</span>
                </h1>
                <p className="max-w-3xl text-lg md:text-xl text-gray-400">
                    Most TradingView indicators lag behind the price. We build tools that show you the market’s true skeleton—the volume and leverage that actually move the needle before the candle even closes.
                </p>
            </section>

            {/* Indicator Carousel */}
            <div className="w-full overflow-hidden bg-[#050505] py-12 border-y border-white/5">
                <div className="flex animate-scroll hover:[animation-play-state:paused] gap-12 px-6">
                    {/* Double the items for infinite effect */}
                    {[...wikiArticles, ...wikiArticles].map((article, idx) => (
                        <Link 
                            key={`${article.id}-${idx}`}
                            href={`/docs/${article.slug}`}
                            className="flex-shrink-0 group flex flex-col items-center space-y-4"
                        >
                            <div className="relative w-64 h-40 rounded-2xl overflow-hidden border border-white/10 group-hover:border-solquant-gold/50 transition-all duration-500 shadow-2xl">
                                <Image 
                                    src={article.screenshotUrl || article.imageUrl || '/images/logo.png'} 
                                    alt={article.title} 
                                    fill 
                                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 group-hover:text-solquant-gold transition-colors font-mono">
                                {article.title}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Product Suites */}
            <section id="suites" className="w-full max-w-[1800px] px-6 py-24 mx-auto border-t border-white/5">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Choose your level. Own your edge.</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Suite A: Trader */}
                    <div className="relative group overflow-hidden rounded-3xl border border-solquant-gold/30 bg-[#0a0a0a]/60 backdrop-blur-xl transition-all duration-500 hover:border-solquant-gold/60 hover:shadow-[0_0_50px_rgba(212,175,55,0.25)] flex flex-col h-full shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-solquant-gold/5 via-transparent to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-700"></div>
                        
                        {/* Suite Image Header */}
                        <div className="relative w-full h-56 overflow-hidden">
                            <Image
                                src="/images/scalper.jpg"
                                alt="Trader"
                                fill
                                className="object-cover opacity-70 group-hover:opacity-90 transition-all duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent"></div>
                        </div>


                        <div className="px-8 pb-8 -mt-14 relative z-10 flex-grow flex flex-col">
                             <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-3xl font-bold tracking-tight group-hover:text-solquant-gold transition-colors">Trader</h3>
                                    <span className="text-solquant-gold font-bold text-3xl whitespace-nowrap font-mono">$19.99/mo</span>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Seven precision indicators. One coherent system for reading trend, momentum, and market structure.
                                </p>
                            </div>

                            <div className="space-y-4 mb-10">
                                <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Trader Indicators</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {wikiArticles.filter((a: any) => a.categories?.some((c: string) => c === 'Trader')).map((article: any) => (
                                        <Link
                                            key={article.id}
                                            href={`/docs/${article.slug}`}
                                            className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-solquant-gold/10 hover:border-solquant-gold/30 transition-all duration-300 group/item"
                                        >
                                            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                                                <Image
                                                    src={article.screenshotUrl || article.imageUrl || '/images/logo.png'}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="text-xs font-semibold text-gray-300 group-hover/item:text-solquant-gold transition-colors">{article.title}</span>
                                            <svg className="w-4 h-4 ml-auto text-gray-600 group-hover/item:text-solquant-gold transition-transform group-hover/item:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto pt-6 flex flex-col items-center w-full">
                                <Link
                                    href="https://whop.com/solquant/tradercore/"
                                    target="_blank"

                                    rel="noopener noreferrer"
                                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-2xl bg-solquant-gold text-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] hover:scale-[1.02] transition-all duration-300 group/btn"
                                >
                                    <span>Subscribe via Whop</span>
                                    <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                                <p className="mt-6 text-[10px] text-gray-500 font-medium leading-relaxed text-center max-w-[90%]">
                                    By clicking, you will be redirected to our secure store on Whop. Your purchase is subject to our <Link href="/terms" className="text-gray-400 underline hover:text-solquant-gold transition-colors">Terms of Service</Link> and <Link href="/privacy" className="text-gray-400 underline hover:text-solquant-gold transition-colors">Privacy Policy</Link>.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Suite B: Pro Trader */}
                    <div className="relative group overflow-hidden rounded-3xl border border-solquant-gold/30 bg-[#0a0a0a]/60 backdrop-blur-xl transition-all duration-500 hover:border-solquant-gold/60 hover:shadow-[0_0_50px_rgba(212,175,55,0.25)] flex flex-col h-full shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-solquant-gold/5 via-transparent to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-700"></div>
                        
                        {/* Suite Image Header */}
                        <div className="relative w-full h-56 overflow-hidden">
                            <Image
                                src="/images/liquidation.jpg"
                                alt="Pro Trader"
                                fill
                                className="object-cover opacity-70 group-hover:opacity-90 transition-all duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent"></div>
                        </div>


                        <div className="px-8 pb-8 -mt-14 relative z-10 flex-grow flex flex-col">
                             <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-3xl font-bold tracking-tight group-hover:text-solquant-gold transition-colors">Pro Trader</h3>
                                    <span className="text-solquant-gold font-bold text-3xl whitespace-nowrap font-mono">$39.99/mo</span>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    See where leveraged positions are stacked before they get hunted. Stop being the exit liquidity — start trading the levels institutions actually care about.
                                </p>
                            </div>

                            <div className="space-y-6 mb-10">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-solquant-gold font-bold">Pro Trader</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {wikiArticles.filter((a: any) => a.categories?.some((c: string) => c === 'Pro Trader') && !a.categories?.some((c: string) => c === 'Trader')).map((article: any) => (
                                            <Link
                                                key={article.id}
                                                href={`/docs/${article.slug}`}
                                                className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-solquant-gold/10 hover:border-solquant-gold/30 transition-all duration-300 group/item"
                                            >
                                                <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                                                    <Image
                                                        src={article.screenshotUrl || article.imageUrl || '/images/logo.png'}
                                                        alt={article.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <span className="text-xs font-semibold text-gray-300 group-hover/item:text-solquant-gold transition-colors">{article.title}</span>
                                                <svg className="w-4 h-4 ml-auto text-gray-600 group-hover/item:text-solquant-gold transition-transform group-hover/item:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Trader Indicators</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {wikiArticles.filter((a: any) => a.categories?.some((c: string) => c === 'Trader')).map((article: any) => (
                                            <Link
                                                key={article.id}
                                                href={`/docs/${article.slug}`}
                                                className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-solquant-gold/10 hover:border-solquant-gold/30 transition-all duration-300 group/item"
                                            >
                                                <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                                                    <Image
                                                        src={article.screenshotUrl || article.imageUrl || '/images/logo.png'}
                                                        alt={article.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <span className="text-xs font-semibold text-gray-300 group-hover/item:text-solquant-gold transition-colors">{article.title}</span>
                                                <svg className="w-4 h-4 ml-auto text-gray-600 group-hover/item:text-solquant-gold transition-transform group-hover/item:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-6 flex flex-col items-center w-full">
                                <Link
                                    href="https://whop.com/solquant/solquant-pro-trader/"
                                    target="_blank"

                                    rel="noopener noreferrer"
                                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-2xl bg-solquant-gold text-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] hover:scale-[1.02] transition-all duration-300 group/btn"
                                >
                                    <span>Subscribe via Whop</span>
                                    <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                                <p className="mt-6 text-[10px] text-gray-500 font-medium leading-relaxed text-center max-w-[90%]">
                                    By clicking, you will be redirected to our secure store on Whop. Your purchase is subject to our <Link href="/terms" className="text-gray-400 underline hover:text-solquant-gold transition-colors">Terms of Service</Link> and <Link href="/privacy" className="text-gray-400 underline hover:text-solquant-gold transition-colors">Privacy Policy</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
 
                    {/* Suite C: Strategist */}
                    <div className="relative group overflow-hidden rounded-3xl border border-solquant-gold/30 bg-[#0a0a0a]/60 backdrop-blur-xl transition-all duration-500 hover:border-solquant-gold/60 hover:shadow-[0_0_50px_rgba(212,175,55,0.25)] flex flex-col h-full shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-solquant-gold/5 via-transparent to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-700"></div>
                        
                        {/* Suite Image Header */}
                        <div className="relative w-full h-56 overflow-hidden">
                            <Image
                                src="/images/notion/3202e378-b76a-8012-b003-eadc4c2d6337_cf7527d4.jpg"
                                alt="Strategist"
                                fill
                                className="object-cover opacity-70 group-hover:opacity-90 transition-all duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent"></div>
                        </div>

                        <div className="px-8 pb-8 -mt-14 relative z-10 flex-grow flex flex-col">
                             <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-3xl font-bold tracking-tight group-hover:text-solquant-gold transition-colors">Strategist</h3>
                                    <span className="text-solquant-gold font-bold text-3xl whitespace-nowrap font-mono">$59.99/mo</span>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Everything in Pro Trader, plus backtested strategy signals built on the same indicators. Stop building the system. Start running it.
                                </p>
                            </div>

                            <div className="space-y-6 mb-10">
                                {/* Strategist Signals */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-solquant-gold font-bold">Strategist</h4>
                                    <div className="grid grid-cols-1 gap-2">
                                        {strategies.slice(0, 3).map((strategy: any) => (
                                            <Link
                                                key={strategy.id}
                                                href={`/strategies/${strategy.slug}`}
                                                className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-solquant-gold/10 hover:border-solquant-gold/30 transition-all duration-300 group/item"
                                            >
                                                <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                                                    <Image
                                                        src={strategy.imageUrl && strategy.imageUrl !== '/images/logo.png' ? strategy.imageUrl : '/images/liquidation.jpg'}
                                                        alt={strategy.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-semibold text-gray-300 group-hover/item:text-solquant-gold transition-colors line-clamp-1">{strategy.title}</span>
                                                    {strategy.stats?.net_profit_pct && (
                                                        <span className="text-[10px] font-mono text-solquant-gold">+{strategy.stats.net_profit_pct.toFixed(0)}% Profit</span>
                                                    )}
                                                </div>
                                                <svg className="w-4 h-4 ml-auto text-gray-600 group-hover/item:text-solquant-gold transition-transform group-hover/item:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Pro Trader Indicators */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Pro Trader Indicators</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {wikiArticles.filter((a: any) => a.categories?.some((c: string) => c === 'Pro Trader') && !a.categories?.some((c: string) => c === 'Trader')).map((article: any) => (
                                            <Link
                                                key={article.id}
                                                href={`/docs/${article.slug}`}
                                                className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-solquant-gold/10 hover:border-solquant-gold/30 transition-all duration-300 group/item"
                                            >
                                                <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                                                    <Image
                                                        src={article.screenshotUrl || article.imageUrl || '/images/logo.png'}
                                                        alt={article.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <span className="text-xs font-semibold text-gray-300 group-hover/item:text-solquant-gold transition-colors">{article.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Trader Indicators */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Trader Indicators</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {wikiArticles.filter((a: any) => a.categories?.some((c: string) => c === 'Trader')).map((article: any) => (
                                            <Link
                                                key={article.id}
                                                href={`/docs/${article.slug}`}
                                                className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-solquant-gold/10 hover:border-solquant-gold/30 transition-all duration-300 group/item"
                                            >
                                                <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                                                    <Image
                                                        src={article.screenshotUrl || article.imageUrl || '/images/logo.png'}
                                                        alt={article.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <span className="text-xs font-semibold text-gray-300 group-hover/item:text-solquant-gold transition-colors">{article.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-6 flex flex-col items-center w-full">
                                <div className="w-full inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-2xl bg-white/5 border border-white/10 text-gray-500 font-black text-xs uppercase tracking-[0.2em] cursor-not-allowed">
                                    <span>COMING SOON</span>
                                </div>
                                <p className="mt-6 text-[10px] text-gray-500 font-medium leading-relaxed text-center max-w-[90%]">
                                    Engineering backtested execution systems. Launching shortly for inner circle members.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Strategies Section */}
            <section id="strategies" className="w-full max-w-screen-2xl px-6 py-24 mx-auto border-t border-white/5">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-solquant-gold/10 border border-solquant-gold/20 text-solquant-gold text-xs font-bold uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-solquant-gold animate-pulse"></span>
                        Coming Soon
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Trading Strategies</h2>
                    <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                        Automated execution systems built for the modern market. Backtested rigorously, engineered for performance.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {strategies.map((strategy: any) => (
                        <div key={strategy.id} className="relative group overflow-hidden rounded-3xl border border-white/5 bg-[#0a0a0a]/40 backdrop-blur-xl transition-all duration-500 hover:border-solquant-gold/40 hover:bg-[#0a0a0a]/60 flex flex-col shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-solquant-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            
                            {/* Strategy Image/Thumbnail Header */}
                            <div className="relative w-full h-48 overflow-hidden">
                                <Image
                                    src={strategy.imageUrl && strategy.imageUrl !== '/images/logo.png' ? strategy.imageUrl : '/images/liquidation.jpg'}
                                    alt={strategy.title}
                                    fill
                                    className="object-cover opacity-60 group-hover:opacity-90 transition-all duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent"></div>
                                <div className="absolute top-6 left-6 flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-solquant-gold bg-black/60 backdrop-blur-md px-3 py-1 border border-solquant-gold/30 rounded-full uppercase tracking-widest shadow-xl">
                                        COMING SOON
                                    </span>
                                </div>
                            </div>

                            <div className="px-8 pb-8 -mt-12 relative z-10 flex-grow">
                                <div className="flex items-end justify-between mb-6">
                                    <div>
                                        <h3 className="text-3xl font-bold tracking-tight mb-2 group-hover:text-solquant-gold transition-colors">{strategy.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 max-w-[80%]">
                                            {strategy.summary || "Advanced execution logic engineered for maximum consistency and risk-adjusted returns."}
                                        </p>
                                    </div>
                                </div>
                                
                                {strategy.stats ? (
                                    <div className="space-y-4">
                                        {strategy.stats.start_date && (
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 w-fit">
                                                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                                                    {strategy.stats.start_date} — {strategy.stats.end_date}
                                                </span>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.05] transition-colors">
                                            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Net Profit</span>
                                            <span className="text-2xl font-black text-solquant-gold tracking-tight">
                                                +{strategy.stats.net_profit_pct.toFixed(0)}%
                                            </span>
                                        </div>
                                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.05] transition-colors">
                                            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Win Rate</span>
                                            <span className="text-2xl font-black text-white tracking-tight">
                                                {strategy.stats.win_rate.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.05] transition-colors">
                                            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Max Drawdown</span>
                                            <span className="text-2xl font-black text-red-500/80 tracking-tight">
                                                -{Math.abs(strategy.stats.max_drawdown_pct).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.05] transition-colors">
                                            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Total Trades</span>
                                            <span className="text-2xl font-black text-white tracking-tight">
                                                {strategy.stats.total_trades}
                                            </span>
                                        </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center border-y border-white/5 opacity-50 italic text-sm">
                                        Performance verification in progress...
                                    </div>
                                )}
                            </div>

                            <div className="px-8 pb-8">
                                <Link 
                                    href={`/strategies/${strategy.slug}`}
                                    className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-solquant-gold text-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] hover:scale-[1.02] transition-all duration-300 group/btn"
                                >
                                    <span>View Performance Logic</span>
                                    <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                    
                    {strategies.length === 0 && (
                        <div className="col-span-full relative group overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] p-12 text-center">
                            <div className="absolute inset-0 bg-gradient-to-b from-solquant-gold/5 to-transparent pointer-events-none"></div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold mb-4">Engineering in Progress</h3>
                                <p className="text-gray-400 max-w-xl mx-auto text-lg leading-relaxed">
                                    We are currently refining our next generation of trading strategies. Check back shortly for updated backtest results.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* The Development Lab (formerly Active Development) */}
            <section className="w-full max-w-screen-2xl px-6 md:px-12 py-12">
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
                                <Link key={item.id} href={`/lab/${item.slug}`} className="break-inside-avoid mb-6 lg:mb-8 group block">
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

                                        <div className="space-y-4">
                                            {item.previewParagraphs && item.previewParagraphs.length > 0 ? (
                                                <div className="space-y-3">
                                                    {item.previewParagraphs.map((p: string, i: number) => (
                                                        <p key={i} className="text-sm text-gray-400 leading-relaxed line-clamp-3">{p}</p>
                                                    ))}
                                                </div>
                                            ) : (
                                                item.description && (
                                                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{item.description}</p>
                                                )
                                            )}

                                            {item.previewImageUrls && item.previewImageUrls.length > 0 ? (
                                                <div className={`grid gap-4 ${item.previewImageUrls.length > 1 ? 'grid-cols-1' : 'grid-cols-1'}`}>
                                                    {item.previewImageUrls.map((url: string, i: number) => (
                                                        <div key={i} className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-black shadow-inner">
                                                            <img
                                                                src={url}
                                                                alt={item.title}
                                                                className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                (item.imageUrl && item.imageUrl !== '/images/logo.png') && (
                                                    <div className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-black shadow-inner">
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.title}
                                                            className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Community Library */}
            <section className="w-full py-24 bg-gradient-to-b from-black to-[#0a0a0a] relative overflow-hidden border-t border-white/5">
                <div className="w-full max-w-screen-2xl px-6 mx-auto relative z-10">
                    <div className="text-center mb-16">
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

            {/* FAQ Section */}
            <FAQ />
        </div>
    );
}
