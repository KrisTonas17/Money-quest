"use client";
import { useState } from "react";
import { createRng } from "@/lib/rng";

const ASSETS = [
  { id: "techco", name: "TechCo Inc.", emoji: "💻", risk: "medium", baseReturn: 0.12 },
  { id: "greenfarm", name: "GreenFarm Foods", emoji: "🌱", risk: "low", baseReturn: 0.06 },
  { id: "rocketride", name: "RocketRide", emoji: "🚀", risk: "high", baseReturn: 0.22 },
  { id: "cozybank", name: "CozyBank Savings", emoji: "🏦", risk: "very-low", baseReturn: 0.04 },
  { id: "craftbrew", name: "CraftBrew Co.", emoji: "🍺", risk: "medium", baseReturn: 0.09 },
  { id: "solarpow", name: "SolarPow Energy", emoji: "☀️", risk: "medium-high", baseReturn: 0.15 },
];

interface Props { modifiers: any; seed: string; onComplete: (score: number) => void }

export function OwnershipOrchard({ modifiers, seed, onComplete }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [phase, setPhase] = useState<"pick" | "grow" | "done">("pick");
  const [results, setResults] = useState<{ name: string; emoji: string; growth: number; event: string }[]>([]);
  const [score, setScore] = useState(0);

  function toggleAsset(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  function runSimulation() {
    const rng = createRng(`${seed}-orchard`);
    const events = [
      "Market wind: 🌬️ bearish quarter",
      "Market wind: 🌟 viral moment!",
      "Market wind: 📰 great earnings report",
      "Market wind: 😰 sector selloff",
      "Market wind: 🤝 major partnership",
    ];
    const r: typeof results = [];
    let totalScore = 50;
    for (const id of selected) {
      const asset = ASSETS.find((a) => a.id === id)!;
      const swing = (rng() - 0.4) * 0.2;
      const growth = Math.round((asset.baseReturn + swing) * 100);
      const event = events[Math.floor(rng() * events.length)];
      r.push({ name: asset.name, emoji: asset.emoji, growth, event });
      totalScore += growth > 0 ? 15 : 0;
    }
    setResults(r);
    setScore(totalScore);
    setPhase("grow");
    setTimeout(() => setPhase("done"), 3000);
  }

  return (
    <div className="space-y-4">
      {phase === "pick" && (
        <>
          <p className="text-slate-300 text-sm text-center">Pick 3 fictional companies to invest in. Choose wisely based on risk!</p>
          <div className="grid grid-cols-2 gap-3">
            {ASSETS.map((a) => (
              <button
                key={a.id}
                onClick={() => toggleAsset(a.id)}
                className={`rounded-2xl p-4 text-left border-2 transition-all ${
                  selected.includes(a.id) ? "border-gold bg-slate-700" : "border-transparent bg-slate-800 hover:bg-slate-700"
                }`}
              >
                <div className="text-2xl">{a.emoji}</div>
                <p className="font-semibold text-white text-sm mt-1">{a.name}</p>
                <p className="text-xs text-slate-400">Risk: {a.risk}</p>
                <p className="text-xs text-green-400">~{Math.round(a.baseReturn * 100)}%/yr</p>
              </button>
            ))}
          </div>
          <button
            onClick={runSimulation}
            disabled={selected.length < 3}
            className="w-full bg-gold disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold py-3 rounded-2xl"
          >
            {selected.length < 3 ? `Pick ${3 - selected.length} more` : "🌱 Grow My Orchard!"}
          </button>
        </>
      )}

      {phase === "grow" && (
        <div className="text-center space-y-4">
          <div className="text-5xl animate-bounce">📈</div>
          <p className="text-gold font-bold text-xl">Market running...</p>
          {results.map((r) => (
            <div key={r.name} className="bg-slate-800 rounded-xl p-3 text-left">
              <p className="font-semibold text-white">{r.emoji} {r.name}</p>
              <p className="text-xs text-slate-400">{r.event}</p>
            </div>
          ))}
        </div>
      )}

      {phase === "done" && (
        <div className="space-y-3">
          <p className="text-center text-xl font-bold text-gold">Results!</p>
          {results.map((r) => (
            <div key={r.name} className={`rounded-2xl p-4 flex justify-between items-center ${r.growth >= 0 ? "bg-green-900/40" : "bg-red-900/40"}`}>
              <div>
                <p className="font-semibold text-white">{r.emoji} {r.name}</p>
                <p className="text-xs text-slate-400">{r.event}</p>
              </div>
              <span className={`font-bold text-lg ${r.growth >= 0 ? "text-green-400" : "text-red-400"}`}>
                {r.growth > 0 ? "+" : ""}{r.growth}%
              </span>
            </div>
          ))}
          <div className="text-center">
            <p className="text-2xl font-bold text-gold">Score: {score}</p>
            <button onClick={() => onComplete(score)} className="mt-3 bg-gold text-slate-900 font-bold px-8 py-3 rounded-2xl">
              Continue →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
