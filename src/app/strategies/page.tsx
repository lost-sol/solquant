import Link from "next/link";
import Image from "next/image";
import { getStrategies } from "@/lib/notion";

export default async function StrategiesPage() {
    const strategies = await getStrategies();

    return (
        <div className="flex flex-col items-center min-h-screen text-foreground px-6 py-24 pb-32">
            <div className="max-w-7xl w-full space-y-16">
                <div className="text-center space-y-6 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-solquant-gold/10 border border-solquant-gold/20 text-solquant-gold text-xs font-bold uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-solquant-gold animate-pulse"></span>
                        Alpha Research Phase
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
                        Automated <span className="text-solquant-gold">Strategies</span>
                    </h1>
                    
                    <p className="text-xl text-gray-400 leading-relaxed">
                        Institutional-grade quantitative models engineered to leverage proprietary liquidity data. 
                        Each strategy is currently in the lab phase, undergoing rigorous out-of-sample validation.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {strategies.map((strategy: any) => (
                        <div key={strategy.id} className="group relative flex flex-col bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden hover:border-solquant-gold/30 hover:bg-[#111111] transition-all duration-500 hover:scale-[1.02] shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-solquant-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            {/* Card Content */}
                            <div className="p-8 flex-1">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="space-y-2">
                                        <div className="text-[10px] font-bold text-solquant-gold border border-solquant-gold/20 bg-solquant-gold/5 px-2 py-0.5 rounded uppercase inline-block">
                                            Beta
                                        </div>
                                        <h3 className="text-2xl font-bold group-hover:text-solquant-gold transition-colors">{strategy.title}</h3>
                                    </div>
                                    {strategy.imageUrl && (
                                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/10 bg-black shadow-inner">
                                            <Image 
                                                src={strategy.imageUrl} 
                                                alt={strategy.title} 
                                                fill 
                                                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                    )}
                                </div>

                                <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3">
                                    {strategy.summary}
                                </p>

                                {strategy.stats && (
                                    <div className="grid grid-cols-2 gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <div className="space-y-1">
                                            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Net Profit</div>
                                            <div className="text-2xl font-bold text-solquant-gold">+{strategy.stats.net_profit_pct.toFixed(0)}%</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Win Rate</div>
                                            <div className="text-2xl font-bold text-white">{strategy.stats.win_rate.toFixed(1)}%</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Max DD</div>
                                            <div className="text-2xl font-bold text-red-500/80">-{Math.abs(strategy.stats.max_drawdown_pct).toFixed(1)}%</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Total Trades</div>
                                            <div className="text-2xl font-bold text-white">{strategy.stats.total_trades}</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Card Footer */}
                            <div className="p-8 pt-0 mt-auto">
                                <div
                                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/[0.04] border border-white/10 text-gray-500 font-bold text-sm uppercase tracking-wide cursor-not-allowed"
                                >
                                    Coming Soon
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
