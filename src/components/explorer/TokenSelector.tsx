"use client";

const TOKEN_COLORS: Record<string, string> = {
  SOL: "bg-purple-500/20 border-purple-500/40 text-purple-300",
  ETH: "bg-blue-500/20 border-blue-500/40 text-blue-300",
  BTC: "bg-orange-500/20 border-orange-500/40 text-orange-300",
  SUI: "bg-sky-500/20 border-sky-500/40 text-sky-300",
  HYPE: "bg-teal-500/20 border-teal-500/40 text-teal-300",
  BNB: "bg-yellow-500/20 border-yellow-500/40 text-yellow-300",
};

const TOKEN_ACTIVE: Record<string, string> = {
  SOL: "bg-purple-500/40 border-purple-400 text-purple-100",
  ETH: "bg-blue-500/40 border-blue-400 text-blue-100",
  BTC: "bg-orange-500/40 border-orange-400 text-orange-100",
  SUI: "bg-sky-500/40 border-sky-400 text-sky-100",
  HYPE: "bg-teal-500/40 border-teal-400 text-teal-100",
  BNB: "bg-yellow-500/40 border-yellow-400 text-yellow-100",
};

interface TokenSelectorProps {
  tokens: string[];
  selected: string;
  onSelect: (token: string) => void;
}

export default function TokenSelector({ tokens, selected, onSelect }: TokenSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tokens.map((token) => {
        const isActive = token === selected;
        const colorClass = isActive
          ? TOKEN_ACTIVE[token] || "bg-solquant-gold/30 border-solquant-gold text-solquant-gold"
          : TOKEN_COLORS[token] || "bg-white/5 border-white/10 text-gray-400";

        return (
          <button
            key={token}
            onClick={() => onSelect(token)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border transition-all duration-200 cursor-pointer ${colorClass}`}
          >
            {token}
          </button>
        );
      })}
    </div>
  );
}
