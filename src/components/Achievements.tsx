"use client";

const ALL_ACHIEVEMENTS = [
  { id: "owner-mindset", label: "Owner Mindset", emoji: "🏦", desc: "Ownership trait ≥ 70" },
  { id: "streak-master", label: "Streak Master", emoji: "🔥", desc: "PYF streak ≥ 5" },
  { id: "impulse-slayer", label: "Impulse Slayer", emoji: "⚔️", desc: "Temptation ≤ 10%" },
  { id: "goal-crusher", label: "Goal Crusher", emoji: "🎯", desc: "Invest bucket ≥ $200" },
];

interface Props { achievements: string[] }

export function Achievements({ achievements }: Props) {
  return (
    <div className="bg-slate-800 rounded-2xl p-5 space-y-3">
      <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Achievements</h2>
      <div className="grid grid-cols-2 gap-2">
        {ALL_ACHIEVEMENTS.map((a) => {
          const unlocked = achievements.includes(a.id);
          return (
            <div key={a.id} className={`rounded-xl p-3 ${unlocked ? "bg-yellow-500/20 border border-yellow-500" : "bg-slate-700 opacity-50"}`}>
              <div className="text-2xl">{a.emoji}</div>
              <p className={`text-xs font-semibold mt-1 ${unlocked ? "text-yellow-400" : "text-slate-400"}`}>{a.label}</p>
              <p className="text-xs text-slate-500">{a.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
