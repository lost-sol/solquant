"use client";

import { useState } from "react";
import Link from "next/link";
import MetricBadge from "@/components/explorer/MetricBadge";
import TokenSelector from "@/components/explorer/TokenSelector";
import TokenComparison from "@/components/explorer/TokenComparison";
import EquityCurve from "@/components/explorer/EquityCurve";
import TradeDistribution from "@/components/explorer/TradeDistribution";
import MonthlyReturns from "@/components/explorer/MonthlyReturns";
import ParamSensitivity from "@/components/explorer/ParamSensitivity";
import TradeLog from "@/components/explorer/TradeLog";
import type { StrategyData } from "@/components/explorer/types";

const STATUS_STYLES: Record<string, string> = {
  production: "text-green-400 border-green-400/20 bg-green-400/5",
  beta: "text-solquant-gold border-solquant-gold/20 bg-solquant-gold/5",
  experimental: "text-gray-400 border-gray-400/20 bg-gray-400/5",
};

export default function StrategyDetailClient({ data }: { data: StrategyData }) {
  const tokens = data.token_comparison.map((tc) => tc.token);
  const [selectedToken, setSelectedToken] = useState(tokens[0] || "SOL");

  const metrics = data.best_params[selectedToken]?.metrics || {};
  const params = data.best_params[selectedToken]?.params || {};
  const equityCurve = data.equity_curves[selectedToken];
  const trades = data.trade_log[selectedToken];
  const distributions = data.trade_distributions[selectedToken];
  const statusStyle = STATUS_STYLES[data.strategy.status] || STATUS_STYLES.experimental;

  return (
    <div className="flex flex-col items-center min-h-screen text-foreground px-6 py-24 pb-32">
      <div className="max-w-6xl w-full space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-3">
            <Link
              href="/strategies/explore"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-solquant-gold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              All Strategies
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">{data.strategy.name}</h1>
              <span className={`text-[10px] font-bold border px-2 py-0.5 rounded uppercase ${statusStyle}`}>
                {data.strategy.status}
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-2xl">{data.strategy.description}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="bg-white/5 px-2 py-1 rounded">{data.strategy.timeframe}</span>
              <span className="bg-white/5 px-2 py-1 rounded">{data.strategy.category}</span>
            </div>
          </div>
          <div className="shrink-0">
            <TokenSelector tokens={tokens} selected={selectedToken} onSelect={setSelectedToken} />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricBadge
            label="Return"
            value={`${(metrics.return_pct as number) > 0 ? "+" : ""}${(metrics.return_pct as number)?.toFixed(1)}%`}
            color="auto"
            numericValue={metrics.return_pct as number}
          />
          <MetricBadge
            label="Max DD"
            value={`${(metrics.max_dd_pct as number)?.toFixed(1)}%`}
            color="red"
          />
          <MetricBadge
            label="Profit Factor"
            value={(metrics.profit_factor as number)?.toFixed(2)}
            color="gold"
          />
          <MetricBadge
            label="Win Rate"
            value={`${(metrics.win_rate as number)?.toFixed(1)}%`}
            color="white"
          />
          <MetricBadge
            label="Calmar"
            value={(metrics.calmar as number)?.toFixed(2)}
            color="gold"
          />
          <MetricBadge
            label="Trades"
            value={metrics.trades as number}
            color="white"
          />
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricBadge
            label="Sharpe"
            value={(metrics.sharpe_ratio as number)?.toFixed(2) || "N/A"}
            color="white"
          />
          <MetricBadge
            label="Best Trade"
            value={`${(metrics.best_trade_pct as number) > 0 ? "+" : ""}${(metrics.best_trade_pct as number)?.toFixed(2)}%`}
            color="green"
          />
          <MetricBadge
            label="Worst Trade"
            value={`${(metrics.worst_trade_pct as number)?.toFixed(2)}%`}
            color="red"
          />
          <MetricBadge
            label="Avg PnL"
            value={`${(metrics.avg_trade_pnl_pct as number) > 0 ? "+" : ""}${(metrics.avg_trade_pnl_pct as number)?.toFixed(2)}%`}
            color="auto"
            numericValue={metrics.avg_trade_pnl_pct as number}
          />
        </div>

        {/* Token Comparison */}
        {data.token_comparison.length > 1 && (
          <TokenComparison data={data.token_comparison} />
        )}

        {/* Equity Curve */}
        {equityCurve && (
          <EquityCurve data={equityCurve.points} initialCapital={equityCurve.initial_capital} />
        )}

        {/* Trade Analysis Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {distributions?.pnl_histogram && (
            <TradeDistribution data={distributions.pnl_histogram} />
          )}
          {distributions?.monthly_returns && (
            <MonthlyReturns data={distributions.monthly_returns} />
          )}
        </div>

        {/* Parameter Sensitivity */}
        {Object.keys(data.parameter_sensitivity).length > 0 && (
          <ParamSensitivity data={data.parameter_sensitivity} />
        )}

        {/* Optimal Parameters */}
        {Object.keys(params).length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-4">Optimal Parameters ({selectedToken})</h3>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(params).map(([key, val]) => (
                  <div key={key} className="space-y-1">
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                      {key.replace(/_/g, " ")}
                    </div>
                    <div className="text-sm font-bold text-white font-mono">{String(val)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trade Log */}
        {trades && trades.length > 0 && <TradeLog trades={trades} />}

        {/* Signal Description */}
        <div className="space-y-12">
          <div>
            <h3 className="text-lg font-bold mb-4">Signal Logic</h3>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
              <p className="text-gray-300 text-sm leading-relaxed">{data.strategy.signal_summary}</p>
            </div>
          </div>

          {/* Subscription CTA */}
          <div className="flex flex-col items-center py-12 border-t border-white/5">
            <div className="max-w-md w-full flex flex-col items-center space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold tracking-tight">Access the Strategist Suite</h3>
                <p className="text-gray-400 text-sm">
                  Get full TradingView access to this strategy and the entire Strategist indicator suite.
                </p>
              </div>
              
              <Link
                href="https://whop.com/solquant/strategist-d2/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-2xl bg-solquant-gold text-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] hover:scale-[1.02] transition-all duration-300 group/btn"
              >
                <span>Subscribe via Whop</span>
                <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <p className="text-[10px] text-gray-500 font-medium leading-relaxed text-center">
                By clicking, you will be redirected to our secure store on Whop. Your purchase is subject to our <Link href="/terms" className="text-gray-400 underline hover:text-solquant-gold transition-colors">Terms of Service</Link> and <Link href="/privacy" className="text-gray-400 underline hover:text-solquant-gold transition-colors">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center text-xs text-gray-600 max-w-2xl mx-auto leading-relaxed pt-8 border-t border-white/5">
          Past performance does not guarantee future results. All data shown is from historical backtests, not live trading.
          Strategies are in active development and parameters may change.
        </div>
      </div>
    </div>
  );
}
