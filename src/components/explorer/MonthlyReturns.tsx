"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

interface MonthlyReturnsProps {
  data: { month: string; return_pct: number; trades: number; wins: number }[];
}

export default function MonthlyReturns({ data }: MonthlyReturnsProps) {
  if (!data || data.length === 0) {
    return <div className="text-gray-500 text-sm text-center py-12">No monthly returns data</div>;
  }

  const chartData = data.map((d) => ({
    ...d,
    label: d.month.length >= 7 ? d.month.slice(0, 7) : d.month,
  }));

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Monthly Returns</h3>
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis
              dataKey="label"
              tick={{ fill: "#666", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#222" }}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tick={{ fill: "#666", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`}
              width={45}
            />
            <ReferenceLine y={0} stroke="#333" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111",
                border: "1px solid #333",
                borderRadius: "12px",
                fontSize: "12px",
                color: "#eee",
              }}
              formatter={(value, _, props) => {
                const v = Number(value);
                const p = (props as { payload: { trades: number; wins: number } }).payload;
                return [`${v > 0 ? "+" : ""}${v.toFixed(2)}% (${p.wins}/${p.trades} wins)`, "Return"];
              }}
            />
            <Bar dataKey="return_pct" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.return_pct >= 0 ? "#22c55e" : "#ef4444"} fillOpacity={0.7} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
