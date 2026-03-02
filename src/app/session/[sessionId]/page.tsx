"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { generateSessionContent } from "@/lib/engine";
import { StoryScene } from "@/components/StoryScene";
import { DecisionCard } from "@/components/DecisionCard";
import { MiniGame } from "@/components/MiniGame";
import { SessionResults } from "@/components/SessionResults";
import { Suspense } from "react";

export type SessionPhase = "story" | "decision" | "minigame" | "results";

function SessionContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = Number(params.sessionId);
  const seed = searchParams.get("seed") || "42";

  const { gameState, applyDecision, completeSession } = useGameStore();
  const [phase, setPhase] = useState<SessionPhase>("story");
  const [sessionContent, setSessionContent] = useState<ReturnType<typeof generateSessionContent> | null>(null);
  const [chosenCard, setChosenCard] = useState<number>(0);
  const [miniGameScore, setMiniGameScore] = useState<number>(0);

  useEffect(() => {
    const content = generateSessionContent(sessionId, seed);
    setSessionContent(content);
  }, [sessionId, seed]);

  if (!sessionContent) return <div className="flex items-center justify-center min-h-screen text-gold text-2xl">Loading quest...</div>;

  function handleDecision(choiceIndex: number) {
    setChosenCard(choiceIndex);
    applyDecision(sessionContent!.decisionCard.choices[choiceIndex].effects);
    setPhase("minigame");
  }

  function handleMiniGameComplete(score: number) {
    setMiniGameScore(score);
    completeSession(sessionId, score);
    setPhase("results");
  }

  function handleNextSession() {
    const nextId = sessionId + 1;
    if (nextId > 8) {
      router.push("/dashboard?completed=true");
    } else if (sessionId % 2 === 0) {
      // After session 2,4,6,8 — boss challenge
      router.push(`/boss/${Math.ceil(sessionId / 2)}?seed=${seed}`);
    } else {
      router.push(`/session/${nextId}?seed=${seed}`);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => router.push("/dashboard")} className="text-slate-400 hover:text-white text-sm">← Dashboard</button>
        <div className="flex-1 bg-slate-800 rounded-full h-2">
          <div
            className="bg-gold h-2 rounded-full transition-all"
            style={{ width: `${(sessionId / 8) * 100}%` }}
          />
        </div>
        <span className="text-xs text-slate-400">Session {sessionId}/8</span>
      </div>

      {phase === "story" && (
        <StoryScene
          content={sessionContent}
          onContinue={() => setPhase("decision")}
        />
      )}
      {phase === "decision" && (
        <DecisionCard
          card={sessionContent.decisionCard}
          gameState={gameState}
          onChoose={handleDecision}
        />
      )}
      {phase === "minigame" && (
        <MiniGame
          type={sessionContent.miniGameType}
          modifiers={sessionContent.miniGameModifiers}
          seed={seed}
          onComplete={handleMiniGameComplete}
        />
      )}
      {phase === "results" && (
        <SessionResults
          content={sessionContent}
          choiceIndex={chosenCard}
          miniGameScore={miniGameScore}
          gameState={gameState}
          onNext={handleNextSession}
        />
      )}
    </main>
  );
}

export default function SessionPage() {
  return (
    <Suspense>
      <SessionContent />
    </Suspense>
  );
}
