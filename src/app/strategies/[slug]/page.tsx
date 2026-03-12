import { getStrategies, getPageContent } from '@/lib/notion';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import TopNav from '@/components/TopNav';
import type { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const strategies = await getStrategies();
    const strategy = strategies.find((s: any) => s.slug === resolvedParams.slug);

    if (!strategy) {
        return {};
    }

    const title = `${strategy.title} | SolQuant Strategies`;
    const description = strategy.summary || "Institutional-grade quantitative models engineered to leverage proprietary liquidity data.";
    const ogImageUrl = (strategy as any).ogImageUrl || strategy.imageUrl || "/images/twitter-header.png";

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
                    alt: strategy.title,
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
    const strategies = await getStrategies();
    return strategies.map((s: any) => ({
        slug: s.slug,
    }));
}

export default async function StrategyPage({ params }: Props) {
    const resolvedParams = await params;
    const strategies = await getStrategies();
    const strategy = strategies.find((s: any) => s.slug === resolvedParams.slug);

    if (!strategy) {
        notFound();
    }

    const blocks = await getPageContent(strategy.id);

    return (
        <main className="min-h-screen bg-[#070707] text-white selection:bg-solquant-gold/30">
            <TopNav />
            
            <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
                <Link 
                    href="/strategies"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-solquant-gold transition-colors mb-8 text-sm uppercase tracking-widest font-bold"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Strategies
                </Link>
 
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{strategy.title}</h1>
                                <span className="text-xs font-bold text-solquant-gold bg-solquant-gold/10 px-3 py-1 border border-solquant-gold/20 rounded-full uppercase tracking-tighter">
                                    COMING SOON
                                </span>
                            </div>
                            <p className="text-xl text-gray-400 leading-relaxed max-w-3xl">
                                {strategy.summary}
                            </p>
                        </div>
 
                        {strategy.imageUrl && strategy.imageUrl !== '/images/logo.png' && (
                            <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                                <Image 
                                    src={strategy.imageUrl} 
                                    alt={strategy.title} 
                                    fill 
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                            </div>
                        )}
 
                        <div className="prose prose-invert prose-solquant max-w-none">
                            <div className="space-y-8 text-gray-300">
                                {blocks.map((block: any) => {
                                    if (block.type === 'paragraph') {
                                        return <p key={block.id}>{block.paragraph.rich_text[0]?.plain_text}</p>;
                                    }
                                    if (block.type === 'heading_2') {
                                        return <h2 key={block.id} className="text-2xl font-bold text-white pt-8">{block.heading_2.rich_text[0]?.plain_text}</h2>;
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    </div>
 
                    <div className="space-y-8">
                        {strategy.stats && (
                            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 sticky top-32">
                                <h3 className="text-lg font-bold mb-6 uppercase tracking-widest text-gray-500">Backtest Performance</h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                        <span className="text-gray-400 text-sm">Net Profit</span>
                                        <span className="text-3xl font-bold text-solquant-gold">+{strategy.stats.net_profit_pct.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                        <span className="text-gray-400 text-sm">Win Rate</span>
                                        <span className="text-2xl font-bold text-white">{strategy.stats.win_rate.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                        <span className="text-gray-400 text-sm">Max Drawdown</span>
                                        <span className="text-2xl font-bold text-red-500/80">-{Math.abs(strategy.stats.max_drawdown_pct).toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                        <span className="text-gray-400 text-sm">Total Trades</span>
                                        <span className="text-2xl font-bold text-white">{strategy.stats.total_trades}</span>
                                    </div>
                                </div>
 
                                <div className="mt-8 p-4 rounded-xl bg-solquant-gold/5 border border-solquant-gold/20 text-xs text-solquant-gold/70 leading-relaxed italic">
                                    * Results based on backtest data from Binance Futures (ETHUSDT.P/SOLUSDT.P). Past performance does not guarantee future results.
                                </div>
                                
                                <button className="w-full mt-8 py-4 bg-solquant-gold text-black font-bold uppercase tracking-widest rounded-xl hover:bg-yellow-500 transition-all opacity-50 cursor-not-allowed">
                                    Coming Soon
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
