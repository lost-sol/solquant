import ExplorerCard from "@/components/explorer/ExplorerCard";
import manifest from "@/data/backtest-explorer/manifest.json";
import Link from "next/link";

export const metadata = {
  title: "Strategy Explorer | SolQuant",
  description: "Explore institutional-grade quantitative trading strategies with full transparency. Detailed backtest performance across 15+ tokens including SOL, ETH, and BTC.",
  openGraph: {
    title: "Strategy Explorer | SolQuant",
    description: "Explore institutional-grade quantitative trading strategies with full transparency.",
    type: "website",
    url: "https://solquant.xyz/strategies",
    images: [
      {
        url: "/images/notion/3202e378-b76a-804b-859e-f9696f2626b5_b441b5c5-og.jpg", // Using Mean Reversion as the featured explorer image
        width: 1200,
        height: 630,
        alt: "SolQuant Strategy Explorer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Strategy Explorer | SolQuant",
    description: "Explore institutional-grade quantitative trading strategies with full transparency.",
    images: ["/images/notion/3202e378-b76a-804b-859e-f9696f2626b5_b441b5c5-og.jpg"],
  },
};

export default function StrategiesPage() {
  const strategies = manifest.strategies;

  return (
    <div className="flex flex-col items-center min-h-screen text-foreground px-6 py-24 pb-32">
      <div className="max-w-7xl w-full space-y-16">
        {/* Header */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">


          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
            Strategy <span className="text-solquant-gold">Explorer</span>
          </h1>

          <p className="text-xl text-gray-400 leading-relaxed">
            Deep-dive into backtested performance across tokens, parameters, and market conditions.
            Full transparency on returns, drawdowns, and individual trades.
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span>{strategies.length} Strategies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <span>{new Set(strategies.flatMap((s) => s.tokens)).size} Tokens</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-solquant-gold"></div>
              <span>Updated {new Date(manifest.generated_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-6 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/education/connecting-tradingview-strategies-to-automation-platforms"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/10 bg-white/5 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <span>How to automate these strategies</span>
                <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <Link
                href="https://whop.com/solquant/strategist-d2/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-solquant-gold text-black font-bold text-sm uppercase tracking-wider hover:scale-[1.02] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] group"
              >
                <span>Subscribe via Whop</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            
            <p className="text-[10px] text-gray-500 font-medium leading-relaxed text-center max-w-md">
              By clicking, you will be redirected to our secure store on Whop. Your purchase is subject to our <Link href="/terms" className="text-gray-400 underline hover:text-solquant-gold transition-colors">Terms of Service</Link> and <Link href="/privacy" className="text-gray-400 underline hover:text-solquant-gold transition-colors">Privacy Policy</Link>.
            </p>
          </div>
        </div>

        {/* Strategy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {strategies.map((strategy) => (
            <ExplorerCard key={strategy.id} strategy={strategy} />
          ))}
        </div>

        {/* Disclaimer */}
        <div className="text-center text-xs text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Past performance does not guarantee future results. All data shown is from historical backtests, not live trading.
          Strategies are in active development and parameters may change.
        </div>
      </div>
    </div>
  );
}
