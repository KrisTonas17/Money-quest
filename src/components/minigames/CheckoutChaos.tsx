"use client";
import { useState, useEffect, useCallback } from "react";

const PURCHASES = [
  { item: "Limited-edition sneakers 👟", price: 120, category: "want" },
  { item: "Textbook for class 📚", price: 45, category: "need" },
  { item: "Viral fidget toy 🪀", price: 18, category: "want" },
  { item: "Birthday gift for mom 🎁", price: 30, category: "thoughtful" },
  { item: "Bubble tea 🧋", price: 8, category: "want" },
  { item: "Bus pass for the week 🚌", price: 15, category: "need" },
  { item: "Mystery loot box 📦", price: 25, category: "want" },
  { item: "New headphones 🎧", price: 80, category: "want" },
  { item: "Groceries for home 🛒", price: 55, category: "need" },
  { item: "Trendy phone case 📱", price: 22, category: "want" },
];

interface Props { modifiers: any; onComplete: (score: number) => void }

export function CheckoutChaos({ modifiers, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const current = PURCHASES[index % PURCHASES.length];

  const finish = useCallback(() => {
    if (done) return;
    setDone(true);
    setTimeout(() => onComplete(score), 1500);
  }, [done, score, onComplete]);

  useEffect(() => {
    if (!started || done) return;
    if (timeLeft <= 0) { finish(); return; }
    const t = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [started, timeLeft, done, finish]);

  function decide(action: "buy" | "wait" | "skip") {
    let points = 0;
    let fb = "";
    if (current.category === "need") {
      points = action === "buy" ? 10 : action === "wait" ? 5 : 0;
      fb = action === "buy" ? "✅ Smart! Needs come first." : action === "wait" ? "🤔 It's a need, but you can plan!" : "⚠️ Don't skip essentials!";
    } else {
      points = action === "buy" ? 2 : action === "wait" ? 8 : 10;
      fb = action === "buy" ? "💸 Impulse buy! The owner path waits." : action === "wait" ? "⏳ 24-hour rule activated!" : "🧠 Smart skip — invest those dollars!";
    }
    setScore((s) => s + points);
    setFeedback(fb);
    setTimeout(() => { setFeedback(null); setIndex((i) => i + 1); if (index + 1 >= PURCHASES.length) finish(); }, 800);
  }

  return (
    <div className="space-y-4">
      {!started ? (
        <div className="text-center space-y-4">
          <p className="text-slate-300">Items will flash by. Choose: Buy now, Wait 24h, or Skip entirely!</p>
          <p className="text-slate-400 text-sm">Needs vs wants — choose wisely.</p>
          <button onClick={() => setStarted(true)} className="bg-gold text-slate-900 font-bold px-8 py-3 rounded-2xl">
            Start Shopping! (60s)
          </button>
        </div>
      ) : done ? (
        <div className="text-center space-y-3">
          <div className="text-5xl">{score >= 70 ? "🏆" : score >= 40 ? "👍" : "💡"}</div>
          <p className="text-2xl font-bold text-gold">Score: {score}</p>
          <p className="text-slate-400 text-sm">{score >= 70 ? "Owner mindset unlocked!" : "Keep practicing the 24-hour rule!"}</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Score: {score}</span>
            <span className={`font-bold ${timeLeft <= 10 ? "text-red-400" : "text-gold"}`}>⏱ {timeLeft}s</span>
          </div>

          {feedback ? (
            <div className="bg-slate-700 rounded-2xl p-6 text-center">
              <p className="text-xl">{feedback}</p>
            </div>
          ) : (
            <div className="bg-slate-800 rounded-2xl p-6 text-center space-y-3">
              <p className="text-slate-400 text-sm">Should you buy this?</p>
              <p className="text-xl font-bold text-white">{current.item}</p>
              <p className="text-2xl font-bold text-gold">${current.price}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => decide("buy")} className="bg-red-600 hover:bg-red-500 rounded-2xl p-4 text-center active:scale-95">
              <div className="text-2xl">🛍️</div>
              <p className="text-white font-bold text-sm mt-1">Buy Now</p>
            </button>
            <button onClick={() => decide("wait")} className="bg-yellow-600 hover:bg-yellow-500 rounded-2xl p-4 text-center active:scale-95">
              <div className="text-2xl">⏳</div>
              <p className="text-white font-bold text-sm mt-1">Wait 24h</p>
            </button>
            <button onClick={() => decide("skip")} className="bg-green-600 hover:bg-green-500 rounded-2xl p-4 text-center active:scale-95">
              <div className="text-2xl">🧠</div>
              <p className="text-white font-bold text-sm mt-1">Skip it</p>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
