"use client";
import type { Buckets } from "@/types/game";

interface Props { buckets: Buckets }

export function BucketDisplay({ buckets }: Props) {
  const total = buckets.spend + buckets.save + buckets.invest || 1;
  const items = [
    { key: "spend" as const, label: "Spend", emoji: "🛍️", color: "bg-orange-500", textColor: "text-orange-400" },
    { key: "save" as const, label: "Save", emoji: "🐷", color: "bg-green-500", textColor: "text-green-400" },
    { key: "invest" as const, label: "Invest", emoji: "📈", color: "bg-indigo-500", textColor: "text-indigo-400" },
  ];
  return (
    <div className="bg-slate-800 rounded-2xl p-5 space-y-3">
      <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Money Buckets</h2>
      {items.map((item) => (
        <div key={item.key} className="flex items-center gap-3">
          <span className="text-xl">{item.emoji}</span>
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-300">{item.label}</span>
              <span className={item.textColor + " font-semibold"}>${buckets[item.key].toFixed(2)}</span>
            </div>
            <div className="bg-slate-700 rounded-full h-2">
              <div
                className={`${item.color} h-2 rounded-full`}
                style={{ width: `${(buckets[item.key] / total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
