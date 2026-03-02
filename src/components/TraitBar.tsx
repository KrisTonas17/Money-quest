"use client";
const COLORS: Record<string, string> = {
  discipline: "bg-blue-500",
  awareness: "bg-yellow-500",
  patience: "bg-green-500",
  courage: "bg-red-500",
  ownership: "bg-purple-500",
};
const EMOJIS: Record<string, string> = {
  discipline: "🎯", awareness: "👁️", patience: "⏳", courage: "💪", ownership: "🏦",
};

interface Props { trait: string; value: number }

export function TraitBar({ trait, value }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg">{EMOJIS[trait] || "⭐"}</span>
      <div className="flex-1">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span className="capitalize">{trait}</span>
          <span>{value}</span>
        </div>
        <div className="bg-slate-700 rounded-full h-2">
          <div
            className={`${COLORS[trait] || "bg-slate-400"} h-2 rounded-full transition-all`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
  );
}
