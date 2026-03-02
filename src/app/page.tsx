"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { Suspense } from "react";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { startNewRun, hasSavedRun, loadRun } = useGameStore();
  const [seedInput, setSeedInput] = useState("");
  const [mode, setMode] = useState<"story" | "family" | "endless">("story");

  useEffect(() => {
    const urlSeed = searchParams.get("seed");
    if (urlSeed) setSeedInput(urlSeed);
  }, [searchParams]);

  function handleStart() {
    const seed = seedInput || String(Math.floor(Math.random() * 99999));
    startNewRun(seed, mode);
    router.push(`/session/1?seed=${seed}`);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-6xl mb-2">💰</div>
          <h1 className="text-4xl font-bold text-gold font-display">Money Quest</h1>
          <p className="text-slate-400 mt-1">The Owner's Path</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-5 space-y-3">
          <p className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Choose Mode</p>
          <div className="grid grid-cols-3 gap-2">
            {(["story", "family", "endless"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`py-2 px-3 rounded-xl text-sm font-semibold capitalize transition-all ${
                  mode === m
                    ? "bg-gold text-slate-900"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {m === "story" ? "📖 Story" : m === "family" ? "👨‍👩‍👧 Family" : "♾️ Endless"}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-5 space-y-3">
          <p className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Seed (optional)</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={seedInput}
              onChange={(e) => setSeedInput(e.target.value)}
              placeholder="e.g. 1234"
              className="flex-1 bg-slate-700 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button
              onClick={() => setSeedInput(String(Math.floor(Math.random() * 99999)))}
              className="bg-slate-600 hover:bg-slate-500 rounded-xl px-3 py-2 text-sm"
            >
              🎲 Random
            </button>
          </div>
          <p className="text-xs text-slate-500">Share the same seed with family to play identical scenarios!</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleStart}
            className="w-full bg-gold hover:bg-yellow-400 text-slate-900 font-bold py-4 rounded-2xl text-lg transition-all active:scale-95"
          >
            🚀 Start New Run
          </button>
          {hasSavedRun() && (
            <button
              onClick={() => { loadRun(); router.push("/dashboard"); }}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-2xl transition-all"
            >
              ▶️ Continue Last Run
            </button>
          )}
          <button
            onClick={() => router.push("/family")}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-2xl transition-all"
          >
            👨‍👩‍👧 Family League Compare
          </button>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
