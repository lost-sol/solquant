import Link from "next/link";

export default function StrategiesPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-foreground px-6 py-20">
            <div className="max-w-4xl w-full text-center space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-solquant-gold/10 border border-solquant-gold/20 text-solquant-gold text-xs font-bold uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-solquant-gold animate-pulse"></span>
                    Laboratory Phase
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
                    Automated <span className="text-solquant-gold">Strategies</span>
                </h1>
                
                <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    We are engineering a generation of systematic trading models that bridge the gap between institutional data and retail execution.
                </p>

                <div className="relative mt-12 p-12 border border-white/5 bg-[#0a0a0a] rounded-3xl overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-solquant-gold/10 via-transparent to-transparent opacity-50"></div>
                    
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-3xl font-bold italic">COMING SOON</h2>
                        <div className="flex flex-wrap justify-center gap-4 text-sm font-mono text-gray-500 uppercase tracking-widest">
                            <span>Backtest Engine</span>
                            <span className="text-solquant-gold/30">•</span>
                            <span>Live Execution API</span>
                            <span className="text-solquant-gold/30">•</span>
                            <span>Risk Management Layer</span>
                        </div>
                        <div className="pt-6">
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center px-8 py-3.5 font-bold text-black bg-solquant-gold rounded-2xl hover:bg-yellow-600 transition-all uppercase tracking-wide text-sm"
                            >
                                Back to Command Center
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
