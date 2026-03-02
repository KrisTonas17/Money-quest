"use client";
import { useState, useEffect, useCallback } from "react";

interface Props {
  modifiers: { targetRatios?: { spend: number; save: number; invest: number }; timeLimit?: number };
  onComplete: (score: number) => void;
}

interface Coin { id: number; value: number; placed: boolean; bucket: string | null }

export function BucketSprint({ modifiers, onComplete }: Props) {
  const target = modifiers.targetRatios || { spend: 0.4, save: 0.35, invest: 0.25 };
  const timeLimit = modifiers.timeLimit || 20;
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [started, setStarted] = useState(false);
  const [buckets, setBuckets] = useState({ spend: 0, save: 0, invest: 0 });
  const [coins] = useState<number[]>([10, 10, 10, 10, 10, 5, 5, 5, 20]);
  const [placed, setPlaced] = useState<number[]>([]);
  const [coinIndex, setCoinIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  const total = coins.reduce((a, b) => a + b, 0);

  const finish = useCallback(() => {
    if (done) return;
    setDone(true);
    const totDollar = buckets.spend + buckets.save + buckets.invest || 1;
    const actualRatios = {
      spend: buckets.spend / totDollar,
      save: buckets.save / totDollar,
      invest: buckets.invest / totDollar,
    };
    const diff = Math.abs(actualRatios.spend - target.spend) +
      Math.abs(actualRatios.save - target.save) +
      Math.abs(actualRatios.invest - target.invest);
    const s = Math.max(0, Math.round((1 - diff / 2) * 100));
    setScore(s);
    setTimeout(() => onComplete(s), 2000);
  }, [done, buckets, target, onComplete]);

  useEffect(() => {
    if (!started || done) return;
    if (timeLeft <= 0) { finish(); return; }
    const t = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [started, timeLeft, done, finish]);

  function placeCoin(bucket: "spend" | "save" | "invest") {
    if (!started || coinIndex >= coins.length) return;
    setBuckets((b) => ({ ...b, [bucket]: b[bucket] + coins[coinIndex] }));
    setCoinIndex((i) => i + 1);
    if (coinIndex + 1 >= coins.length) finish();
  }

  const bucketConfig = [
    { key: "spend" as const, label: "Spend", emoji: "🛍️", color: "bg-orange-500", targetPct: Math.round(target.spend * 100) },
    { key: "save" as const, label: "Save", emoji: "🐷", color: "bg-green-500", targetPct: Math.round(target.save * 100) },
    { key: "invest" as const, label: "Invest", emoji: "📈", color: "bg-indigo-500", targetPct: Math.round(target.invest * 100) },
  ];

  return (
    <div className="space-y-4">
      {!started ? (
        <div className="text-center space-y-4">
          <p className="text-slate-300">Tap buckets to allocate each coin! Try to match the target ratios.</p>
          <div className="flex justify-center gap-4 text-sm">
            {bucketConfig.map(b => (
              <div key={b.key} className="text-center">
                <div className={`w-12 h-12 ${b.color} rounded-xl flex items-center justify-center text-2xl mx-auto`}>{b.emoji}</div>
                <p className="text-slate-400 mt-1">{b.targetPct}%</p>
                <p className="text-white text-xs">{b.label}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setStarted(true)} className="bg-gold text-slate-900 font-bold px-8 py-3 rounded-2xl">
            Start! ({timeLimit}s)
          </button>
        </div>
      ) : done ? (
        <div className="text-center space-y-3">
          <div className="text-5xl">{score >= 80 ? "🎉" : score >= 50 ? "👍" : "💪"}</div>
          <p className="text-2xl font-bold text-gold">Score: {score}</p>
          <p className="text-slate-400">Spend: ${buckets.spend} | Save: ${buckets.save} | Invest: ${buckets.invest}</p>
        </div>
      ) : (
        <>
          {/* Timer */}
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Coin {coinIndex + 1}/{coins.length}</span>
            <span className={`font-bold text-lg ${timeLeft <= 5 ? "text-red-400" : "text-gold"}`}>⏱ {timeLeft}s</span>
          </div>
          <div className="bg-slate-700 rounded-full h-2">
            <div className="bg-gold h-2 rounded-full transition-all" style={{ width: `${(timeLeft / timeLimit) * 100}%` }} />
          </div>

          {/* Current coin */}
          {coinIndex < coins.length && (
            <div className="text-center py-4">
              <div className="text-5xl">🪙</div>
              <p className="text-2xl font-bold text-gold mt-1">${coins[coinIndex]}</p>
              <p className="text-slate-400 text-sm">Where should this go?</p>
            </div>
          )}

          {/* Buckets */}
          <div className="grid grid-cols-3 gap-3">
            {bucketConfig.map((b) => (
              <button
                key={b.key}
                onClick={() => placeCoin(b.key)}
                className={`${b.color} hover:opacity-90 rounded-2xl p-4 text-center active:scale-95 transition-all`}
              >
                <div className="text-3xl">{b.emoji}</div>
                <p className="text-white font-bold text-sm mt-1">{b.label}</p>
                <p className="text-white/80 text-xs">${buckets[b.key]}</p>
                <p className="text-white/60 text-xs">goal {b.targetPct}%</p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
