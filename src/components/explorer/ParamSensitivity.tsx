"use client";

interface ParamEntry {
  value: number | string | boolean;
  avg_return: number;
  avg_dd: number;
  sample_count: number;
}

interface ParamSensitivityProps {
  data: Record<string, ParamEntry[]>;
}

function getReturnColor(val: number): string {
  if (val >= 30) return "bg-green-500/60 text-green-100";
  if (val >= 15) return "bg-green-500/40 text-green-200";
  if (val >= 5) return "bg-green-500/20 text-green-300";
  if (val >= 0) return "bg-white/5 text-gray-300";
  if (val >= -10) return "bg-red-500/20 text-red-300";
  if (val >= -30) return "bg-red-500/40 text-red-200";
  return "bg-red-500/60 text-red-100";
}

export default function ParamSensitivity({ data }: ParamSensitivityProps) {
  const params = Object.entries(data);
  if (params.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Parameter Sensitivity</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {params.map(([paramName, entries]) => (
          <div key={paramName} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              {paramName.replace(/_/g, " ")}
            </div>
            <div className="space-y-1.5">
              {entries.map((entry) => {
                const colorClass = getReturnColor(entry.avg_return);
                const displayVal = typeof entry.value === "boolean"
                  ? entry.value ? "Yes" : "No"
                  : String(entry.value);
                return (
                  <div key={String(entry.value)} className="flex items-center gap-2">
                    <div className="text-xs font-mono text-gray-400 w-16 text-right shrink-0">
                      {displayVal}
                    </div>
                    <div className="flex-1 relative h-7">
                      <div
                        className={`h-full rounded-md flex items-center px-2 text-xs font-bold ${colorClass}`}
                        style={{
                          width: `${Math.max(20, Math.min(100, Math.abs(entry.avg_return) * 2 + 20))}%`,
                        }}
                      >
                        {entry.avg_return > 0 ? "+" : ""}{entry.avg_return.toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-600 w-10 text-right shrink-0">
                      n={entry.sample_count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
