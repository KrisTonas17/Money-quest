"use client";
import type { SessionContent } from "@/types/game";

interface Props {
  content: SessionContent;
  onContinue: () => void;
}

export function StoryScene({ content, onContinue }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-2">📖</div>
        <h2 className="text-xl font-bold text-gold font-display">{content.title}</h2>
      </div>

      <div className="bg-slate-800 rounded-2xl p-5 space-y-4">
        <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
          {content.storyText}
        </div>
      </div>

      <div className="bg-slate-900 border border-purple-800 rounded-2xl p-4">
        <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-2">🎯 Today's Quest</p>
        <ul className="space-y-1">
          {content.learningObjectives.map((obj, i) => (
            <li key={i} className="text-sm text-slate-300 flex gap-2">
              <span className="text-purple-400">•</span> {obj}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-gold hover:bg-yellow-400 text-slate-900 font-bold py-4 rounded-2xl text-lg transition-all active:scale-95"
      >
        Make Your Move →
      </button>
    </div>
  );
}
