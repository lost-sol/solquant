"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface TradeDistributionProps {
  data: { bucket: string; count: number }[];
}

export default function TradeDistribution({ data }: TradeDistributionProps) {
  if (!data || data.length === 0) {
    return <div className="text-gray-500 text-sm text-center py-12">No trade distribution data</div>;
  }

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">PnL Distribution</h3>
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis
              dataKey="bucket"
              tick={{ fill: "#666", fontSize: 9 }}
              tickLine={false}
              axisLine={{ stroke: "#222" }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: "#666", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111",
                border: "1px solid #333",
                borderRadius: "12px",
                fontSize: "12px",
                color: "#eee",
              }}
              formatter={(value) => [String(value), "Trades"]}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry) => {
                const isNeg = entry.bucket.startsWith("-") || entry.bucket.startsWith("<-");
                return <Cell key={entry.bucket} fill={isNeg ? "#ef4444" : "#22c55e"} fillOpacity={0.7} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
