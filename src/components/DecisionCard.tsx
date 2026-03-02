"use client";
import { useState } from "react";
import type { DecisionCardData, GameState } from "@/types/game";

interface Props {
  card: DecisionCardData;
  gameState: GameState;
  onChoose: (index: number) => void;
}

export function DecisionCard({ card, gameState, onChoose }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const traitEmojis: Record<string, string> = {
    discipline: "🎯", awareness: "👁️", patience: "⏳", courage: "💪", ownership: "🏦",
  };

  function formatEffect(key: string, val: number) {
    const sign = val > 0 ? "+" : "";
    if (["spend", "save", "invest"].includes(key)) return `${sign}$${val} ${key}`;
    if (["temptation"].includes(key)) return `${sign}${val} temptation`;
    return `${sign}${val} ${key}`;
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="text-4xl mb-2">🃏</div>
        <h2 className="text-lg font-bold text-white">{card.scenario}</h2>
        {card.context && <p className="text-slate-400 text-sm mt-1">{card.context}</p>}
      </div>

      <div className="space-y-3">
        {card.choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => { setSelected(i); setTimeout(() => onChoose(i), 400); }}
            className={`w-full text-left bg-slate-800 hover:bg-slate-700 rounded-2xl p-4 border-2 transition-all active:scale-95 ${
              selected === i ? "border-gold" : "border-transparent hover:border-slate-600"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{choice.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-white">{choice.label}</p>
                <p className="text-sm text-slate-400 mt-0.5">{choice.description}</p>
                {/* Effect pills */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {Object.entries(choice.effects).map(([k, v]) => (
                    <span
                      key={k}
                      className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                        (v as number) > 0
                          ? "bg-green-900 text-green-300"
                          : "bg-red-900 text-red-300"
                      }`}
                    >
                      {formatEffect(k, v as number)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
