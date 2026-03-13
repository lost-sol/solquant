"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const TOKEN_COLORS: Record<string, string> = {
  SOL: "#9945FF",
  ETH: "#627EEA",
  BTC: "#F7931A",
  SUI: "#4DA2FF",
  HYPE: "#00D4AA",
  BNB: "#F3BA2F",
};

interface TokenComparisonProps {
  data: { token: string; return_pct: number | null; max_dd_pct: number | null; win_rate: number | null; profit_factor: number | null; trades: number }[];
}

export default function TokenComparison({ data }: TokenComparisonProps) {
  if (!data || data.length === 0) return null;

  const chartData = data.map((d) => ({
    ...d,
    label: `${d.token} (${d.trades} trades)`,
  }));

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Token Comparison</h3>
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
        <ResponsiveContainer width="100%" height={Math.max(180, data.length * 50)}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 5 }}>
            <XAxis
              type="number"
              tick={{ fill: "#666", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#222" }}
              tickFormatter={(v) => `${v > 0 ? "+" : ""}${v.toFixed(0)}%`}
            />
            <YAxis
              type="category"
              dataKey="token"
              tick={{ fill: "#ccc", fontSize: 12, fontWeight: "bold" }}
              tickLine={false}
              axisLine={false}
              width={45}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111",
                border: "1px solid #333",
                borderRadius: "12px",
                fontSize: "12px",
                color: "#eee",
              }}
              formatter={(value) => [`${Number(value) > 0 ? "+" : ""}${Number(value).toFixed(2)}%`, "Return"]}
            />
            <Bar dataKey="return_pct" radius={[0, 6, 6, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.token} fill={TOKEN_COLORS[entry.token] || "#D4AF37"} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
