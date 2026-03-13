"use client";

interface MetricBadgeProps {
  label: string;
  value: string | number;
  color?: "gold" | "green" | "red" | "white" | "auto";
  numericValue?: number;
  suffix?: string;
}

export default function MetricBadge({ label, value, color = "white", numericValue, suffix = "" }: MetricBadgeProps) {
  let textColor = "text-white";
  if (color === "gold") textColor = "text-solquant-gold";
  else if (color === "green") textColor = "text-green-400";
  else if (color === "red") textColor = "text-red-400";
  else if (color === "auto") {
    const n = numericValue ?? (typeof value === "number" ? value : 0);
    textColor = n > 0 ? "text-green-400" : n < 0 ? "text-red-400" : "text-white";
  }

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center">
      <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">{label}</div>
      <div className={`text-2xl font-bold ${textColor}`}>
        {value}{suffix}
      </div>
    </div>
  );
}
