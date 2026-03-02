"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface RunData {
  playerName: string;
  netWorth: number;
  traits: Record<string, number>;
  streak: number;
  achievements: string[];
  seed: string;
}

export default function FamilyPage() {
  const router = useRouter();
  const [codes, setCodes] = useState<string[]>(["", "", ""]);
  const [players, setPlayers] = useState<RunData[]>([]);
  const [error, setError] = useState("");

  function decode(code: string): RunData | null {
    try {
      const data = JSON.parse(atob(code.trim()));
      return {
        playerName: data.playerName || "Player",
        netWorth: (data.buckets?.spend || 0) + (data.buckets?.save || 0) + (data.buckets?.invest || 0),
        traits: data.traits || {},
        streak: data.streak || 0,
        achievements: data.achievements || [],
        seed: data.seed || "?",
      };
    } catch {
      return null;
    }
  }

  function compare() {
    const results: RunData[] = [];
    for (const code of codes) {
      if (!code.trim()) continue;
      const d = decode(code);
      if (!d) { setError("One or more codes are invalid."); return; }
      results.push(d);
    }
    if (results.length < 2) { setError("Paste at least 2 codes to compare!"); return; }
    setError("");
    setPlayers(results);
  }

  const leader = players.length > 0 ? [...players].sort((a, b) => b.netWorth - a.netWorth)[0] : null;

  return (
    <main className="min-h-screen px-4 py-6 max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/")} className="text-slate-400 hover:text-white">←</button>
        <h1 className="text-2xl font-bold text-gold">👨‍👩‍👧 Family League</h1>
      </div>

      <p className="text-slate-400 text-sm">Each player copies their run code from the Dashboard. Paste them all here to compare!</p>

      <div className="space-y-3">
        {codes.map((c, i) => (
          <input
            key={i}
            value={c}
            onChange={(e) => { const n = [...codes]; n[i] = e.target.value; setCodes(n); }}
            placeholder={`Player ${i + 1} run code…`}
            className="w-full bg-slate-800 rounded-xl px-4 py-3 text-sm font-mono text-green-400 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-gold"
          />
        ))}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button onClick={compare} className="w-full bg-gold hover:bg-yellow-400 text-slate-900 font-bold py-3 rounded-2xl">
        Compare Results
      </button>

      {players.length >= 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">🏆 Leaderboard</h2>
          {players.map((p, i) => (
            <div key={i} className={`bg-slate-800 rounded-2xl p-4 border-2 ${p === leader ? "border-gold" : "border-transparent"}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-white">{p.playerName} {p === leader && "👑"}</span>
                <span className="text-green-400 font-bold">${p.netWorth.toFixed(2)}</span>
              </div>
              <div className="flex gap-3 text-xs text-slate-400">
                <span>🔥 Streak: {p.streak}</span>
                <span>🎯 Seed: {p.seed}</span>
                <span>🏅 {p.achievements.length} achievements</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
