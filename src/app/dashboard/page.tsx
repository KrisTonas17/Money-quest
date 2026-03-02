"use client";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { NetWorthChart } from "@/components/NetWorthChart";
import { TraitBar } from "@/components/TraitBar";
import { BucketDisplay } from "@/components/BucketDisplay";
import { Achievements } from "@/components/Achievements";

export default function DashboardPage() {
  const router = useRouter();
  const { gameState } = useGameStore();
  const { buckets, traits, netWorthHistory, streak, week, session, temptation } = gameState;

  const nextSession = (week - 1) * 2 + session + 1;
  const seed = gameState.seed || "42";

  return (
    <main className="min-h-screen px-4 py-6 max-w-lg mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gold font-display">Dashboard</h1>
        <button onClick={() => router.push("/")} className="text-slate-400 text-sm hover:text-white">🏠 Home</button>
      </div>

      <div className="bg-slate-800 rounded-2xl p-5">
        <p className="text-slate-400 text-sm mb-1">Net Worth</p>
        <p className="text-3xl font-bold text-green-400">
          ${(buckets.spend + buckets.save + buckets.invest).toFixed(2)}
        </p>
        <div className="mt-3">
          <NetWorthChart data={netWorthHistory} />
        </div>
      </div>

      <BucketDisplay buckets={buckets} />

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-orange-400">🔥{streak}</p>
          <p className="text-xs text-slate-400">PYF Streak</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-purple-400">W{week}</p>
          <p className="text-xs text-slate-400">Week</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-400">{temptation}%</p>
          <p className="text-xs text-slate-400">Temptation</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Owner Traits</h2>
        {Object.entries(traits).map(([trait, value]) => (
          <TraitBar key={trait} trait={trait} value={value as number} />
        ))}
      </div>

      <Achievements achievements={gameState.achievements} />

      {nextSession <= 8 && (
        <button
          onClick={() => router.push(`/session/${nextSession}?seed=${seed}`)}
          className="w-full bg-gold hover:bg-yellow-400 text-slate-900 font-bold py-4 rounded-2xl text-lg transition-all"
        >
          ▶️ Continue — Session {nextSession}
        </button>
      )}

      <div className="bg-slate-800 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">Family League Code</h2>
        <p className="text-xs text-slate-500 mb-2">Share this code with family to compare results!</p>
        <div
          className="bg-slate-700 rounded-xl p-3 text-xs text-green-400 font-mono break-all cursor-pointer"
          onClick={() => {
            const code = btoa(JSON.stringify(gameState));
            navigator.clipboard.writeText(code);
          }}
        >
          Click to copy run code
        </div>
      </div>
    </main>
  );
}
