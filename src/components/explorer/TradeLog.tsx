"use client";

import { useState } from "react";

interface Trade {
  entry_time: string;
  exit_time: string;
  direction: string;
  entry_price: number;
  exit_price: number;
  pnl_pct: number;
  exit_reason: string;
}

interface TradeLogProps {
  trades: Trade[];
}

export default function TradeLog({ trades }: TradeLogProps) {
  const [showAll, setShowAll] = useState(false);

  if (!trades || trades.length === 0) {
    return <div className="text-gray-500 text-sm text-center py-12">No trade data available</div>;
  }

  const displayed = showAll ? trades : trades.slice(0, 20);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Trade Log</h3>
        <span className="text-xs text-gray-500">{trades.length} trades</span>
      </div>
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[10px] uppercase tracking-widest text-gray-500 font-bold px-4 py-3">Date</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-gray-500 font-bold px-4 py-3">Dir</th>
                <th className="text-right text-[10px] uppercase tracking-widest text-gray-500 font-bold px-4 py-3">Entry</th>
                <th className="text-right text-[10px] uppercase tracking-widest text-gray-500 font-bold px-4 py-3">Exit</th>
                <th className="text-right text-[10px] uppercase tracking-widest text-gray-500 font-bold px-4 py-3">PnL %</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-gray-500 font-bold px-4 py-3">Reason</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((trade, i) => {
                const isWin = trade.pnl_pct > 0;
                return (
                  <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-2.5 text-gray-400 font-mono text-xs">
                      {trade.entry_time.slice(0, 10)}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs font-bold uppercase ${trade.direction === "long" ? "text-green-400" : "text-red-400"}`}>
                        {trade.direction}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs text-gray-300">
                      ${trade.entry_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs text-gray-300">
                      ${trade.exit_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className={`px-4 py-2.5 text-right font-bold text-xs ${isWin ? "text-green-400" : "text-red-400"}`}>
                      {isWin ? "+" : ""}{trade.pnl_pct?.toFixed(2)}%
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-500">
                      {trade.exit_reason}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {trades.length > 20 && !showAll && (
          <div className="p-4 text-center border-t border-white/5">
            <button
              onClick={() => setShowAll(true)}
              className="text-solquant-gold text-xs font-bold uppercase tracking-wide hover:underline cursor-pointer"
            >
              Show All {trades.length} Trades
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
