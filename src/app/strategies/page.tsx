import ExplorerCard from "@/components/explorer/ExplorerCard";
import manifest from "@/data/backtest-explorer/manifest.json";

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
