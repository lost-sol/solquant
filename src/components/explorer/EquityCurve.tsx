"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface EquityCurveProps {
  data: { date: string; equity: number }[];
  initialCapital: number;
}

export default function EquityCurve({ data, initialCapital }: EquityCurveProps) {
  if (!data || data.length < 2) {
    return <div className="text-gray-500 text-sm text-center py-12">No equity curve data available</div>;
  }

  const minEquity = Math.min(...data.map((d) => d.equity));
  const maxEquity = Math.max(...data.map((d) => d.equity));
  const yMin = Math.floor(minEquity * 0.95);
  const yMax = Math.ceil(maxEquity * 1.05);

  const finalReturn = ((data[data.length - 1].equity - initialCapital) / initialCapital) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Equity Curve</h3>
        <div className={`text-sm font-bold ${finalReturn >= 0 ? "text-green-400" : "text-red-400"}`}>
          {finalReturn >= 0 ? "+" : ""}{finalReturn.toFixed(1)}%
        </div>
      </div>
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: "#666", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#222" }}
              tickFormatter={(v) => {
                const d = new Date(v);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis
              domain={[yMin, yMax]}
              tick={{ fill: "#666", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              width={55}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111",
                border: "1px solid #333",
                borderRadius: "12px",
                fontSize: "12px",
                color: "#eee",
              }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, "Equity"]}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Area
              type="monotone"
              dataKey="equity"
              stroke="#D4AF37"
              strokeWidth={2}
              fill="url(#equityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
