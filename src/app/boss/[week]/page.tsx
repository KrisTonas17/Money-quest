"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { generateBossChallenge } from "@/lib/engine";
import { DecisionCard } from "@/components/DecisionCard";
import { MiniGame } from "@/components/MiniGame";
import { Suspense } from "react";

function BossContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const week = Number(params.week);
  const seed = searchParams.get("seed") || "42";

  const { gameState, applyDecision } = useGameStore();
  const [cards, setCards] = useState<any[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [phase, setPhase] = useState<"cards" | "minigame" | "done">("cards");
  const [forecast, setForecast] = useState("");

  useEffect(() => {
    const boss = generateBossChallenge(week, seed);
    setCards(boss.cards);
    setForecast(boss.forecast);
  }, [week, seed]);

  function handleChoice(idx: number) {
    applyDecision(cards[cardIndex].choices[idx].effects);
    if (cardIndex + 1 < cards.length) {
      setCardIndex(cardIndex + 1);
    } else {
      setPhase("minigame");
    }
  }

  if (!cards.length) return <div className="flex items-center justify-center min-h-screen text-gold">Preparing Boss Challenge...</div>;

  return (
    <main className="min-h-screen px-4 py-6 max-w-lg mx-auto space-y-6">
      {phase === "cards" && (
        <>
          <div className="text-center">
            <div className="text-5xl mb-2">⚔️</div>
            <h1 className="text-2xl font-bold text-red-400">Week {week} Boss Challenge</h1>
            <p className="text-slate-400 text-sm mt-1">Card {cardIndex + 1} of {cards.length}</p>
          </div>
          <DecisionCard card={cards[cardIndex]} gameState={gameState} onChoose={handleChoice} />
        </>
      )}

      {phase === "minigame" && (
        <MiniGame
          type="bucket-sprint"
          modifiers={{ targetRatios: { spend: 0.3, save: 0.3, invest: 0.4 }, timeLimit: 30 }}
          seed={seed}
          onComplete={() => setPhase("done")}
        />
      )}

      {phase === "done" && (
        <div className="text-center space-y-6">
          <div className="text-6xl">🏆</div>
          <h2 className="text-2xl font-bold text-gold">Week {week} Complete!</h2>

          <div className="bg-slate-800 rounded-2xl p-5 text-left">
            <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-2">🔮 Reality Remix — Week {week + 1} Forecast</h3>
            <p className="text-slate-300 text-sm">{forecast}</p>
          </div>

          <button
            onClick={() => router.push(week < 4 ? `/session/${week * 2 + 1}?seed=${seed}` : "/dashboard?completed=true")}
            className="w-full bg-gold hover:bg-yellow-400 text-slate-900 font-bold py-4 rounded-2xl text-lg"
          >
            {week < 4 ? "⚡ Continue to Week " + (week + 1) : "🎉 See Final Results"}
          </button>
        </div>
      )}
    </main>
  );
}

export default function BossPage() {
  return <Suspense><BossContent /></Suspense>;
}
