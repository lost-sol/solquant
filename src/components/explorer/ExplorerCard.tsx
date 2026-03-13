"use client";

import Link from "next/link";

interface StrategyManifest {
  id: string;
  name: string;
  description: string;
  tokens: string[];
  status: string;
  category: string;
  timeframe: string;
  best_token: string | null;
  best_return_pct: number | null;
}

const STATUS_STYLES: Record<string, string> = {
  production: "text-green-400 border-green-400/20 bg-green-400/5",
  beta: "text-solquant-gold border-solquant-gold/20 bg-solquant-gold/5",
  experimental: "text-gray-400 border-gray-400/20 bg-gray-400/5",
};

const TOKEN_DOT_COLORS: Record<string, string> = {
  SOL: "bg-purple-400",
  ETH: "bg-blue-400",
  BTC: "bg-orange-400",
  SUI: "bg-sky-400",
  HYPE: "bg-teal-400",
  BNB: "bg-yellow-400",
};

export default function ExplorerCard({ strategy }: { strategy: StrategyManifest }) {
  const statusStyle = STATUS_STYLES[strategy.status] || STATUS_STYLES.experimental;
  const borderClass = strategy.status === "production" ? "hover:border-solquant-gold/40" : "hover:border-white/20";

  return (
    <Link href={`/strategies/explore/${strategy.id}`}>
      <div className={`group relative flex flex-col bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden ${borderClass} hover:bg-[#111111] transition-all duration-500 hover:scale-[1.02] shadow-2xl h-full`}>
        {strategy.status === "production" && (
          <div className="absolute inset-0 bg-gradient-to-br from-solquant-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        )}

        <div className="p-8 flex-1 relative">
          {/* Status + Title */}
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2">
              <div className={`text-[10px] font-bold border px-2 py-0.5 rounded uppercase inline-block ${statusStyle}`}>
                {strategy.status}
              </div>
              <h3 className="text-2xl font-bold group-hover:text-solquant-gold transition-colors">
                {strategy.name}
              </h3>
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">
              {strategy.timeframe}
            </div>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">
            {strategy.description}
          </p>

          {/* Tokens */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {strategy.tokens.map((token) => (
              <div key={token} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-xs font-bold text-gray-300">
                <div className={`w-1.5 h-1.5 rounded-full ${TOKEN_DOT_COLORS[token] || "bg-gray-400"}`} />
                {token}
              </div>
            ))}
          </div>

          {/* Best Performance */}
          {strategy.best_return_pct !== null && (
            <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Best Return</div>
                <div className={`text-2xl font-bold ${strategy.best_return_pct > 0 ? "text-green-400" : "text-red-400"}`}>
                  {strategy.best_return_pct > 0 ? "+" : ""}{strategy.best_return_pct.toFixed(1)}%
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Best Token</div>
                <div className="text-2xl font-bold text-white">{strategy.best_token}</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 pt-0 mt-auto">
          <div className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-solquant-gold/10 border border-solquant-gold/20 text-solquant-gold font-bold text-sm uppercase tracking-wide group-hover:bg-solquant-gold/20 transition-colors">
            Explore Performance
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
