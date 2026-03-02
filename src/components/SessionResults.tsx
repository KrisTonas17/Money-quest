"use client";
import type { SessionContent, GameState } from "@/types/game";

interface Props {
  content: SessionContent;
  choiceIndex: number;
  miniGameScore: number;
  gameState: GameState;
  onNext: () => void;
}

export function SessionResults({ content, choiceIndex, miniGameScore, gameState, onNext }: Props) {
  const choice = content.decisionCard.choices[choiceIndex];

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="text-5xl mb-2">📊</div>
        <h2 className="text-xl font-bold text-gold">Session Complete!</h2>
      </div>

      <div className="bg-slate-800 rounded-2xl p-5">
        <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Your Decision</p>
        <p className="font-semibold text-white">{choice.emoji} {choice.label}</p>
        <p className="text-slate-400 text-sm mt-1">{choice.description}</p>
      </div>

      <div className="bg-slate-800 rounded-2xl p-5 space-y-3">
        <p className="text-xs text-slate-400 uppercase tracking-wide">Effects</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(choice.effects).map(([k, v]) => (
            <div key={k} className={`rounded-xl p-3 ${(v as number) > 0 ? "bg-green-900/40" : "bg-red-900/40"}`}>
              <p className="text-xs text-slate-400 capitalize">{k}</p>
              <p className={`font-bold ${(v as number) > 0 ? "text-green-400" : "text-red-400"}`}>
                {(v as number) > 0 ? "+" : ""}{v as number}
              </p>
            </div>
          ))}
        </div>
      </div>

      {choice.opportunityCost && (
        <div className="bg-purple-900/30 border border-purple-700 rounded-2xl p-4">
          <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-1">💡 Opportunity Cost</p>
          <p className="text-slate-300 text-sm">{choice.opportunityCost}</p>
        </div>
      )}

      <div className="bg-slate-800 rounded-2xl p-4 flex justify-between items-center">
        <span className="text-slate-300">Mini-game Score</span>
        <span className="text-gold font-bold text-lg">{miniGameScore}</span>
      </div>

      <div className="bg-slate-800 rounded-2xl p-4 flex justify-between items-center">
        <span className="text-slate-300">Net Worth</span>
        <span className="text-green-400 font-bold text-lg">
          ${(gameState.buckets.spend + gameState.buckets.save + gameState.buckets.invest).toFixed(2)}
        </span>
      </div>

      <button
        onClick={onNext}
        className="w-full bg-gold hover:bg-yellow-400 text-slate-900 font-bold py-4 rounded-2xl text-lg transition-all active:scale-95"
      >
        Next Session →
      </button>
    </div>
  );
}
