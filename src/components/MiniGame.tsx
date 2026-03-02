"use client";
import { BucketSprint } from "./minigames/BucketSprint";
import { CheckoutChaos } from "./minigames/CheckoutChaos";
import { OwnershipOrchard } from "./minigames/OwnershipOrchard";
import type { MiniGameType } from "@/types/game";

interface Props {
  type: MiniGameType;
  modifiers: Record<string, any>;
  seed: string;
  onComplete: (score: number) => void;
}

export function MiniGame({ type, modifiers, seed, onComplete }: Props) {
  const titles: Record<MiniGameType, string> = {
    "bucket-sprint": "🪣 Bucket Sprint",
    "checkout-chaos": "🛒 Checkout Chaos",
    "ownership-orchard": "🌳 Ownership Orchard",
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">{titles[type]}</h2>
        <p className="text-slate-400 text-sm">Mini-Game</p>
      </div>
      {type === "bucket-sprint" && <BucketSprint modifiers={modifiers} onComplete={onComplete} />}
      {type === "checkout-chaos" && <CheckoutChaos modifiers={modifiers} onComplete={onComplete} />}
      {type === "ownership-orchard" && <OwnershipOrchard modifiers={modifiers} seed={seed} onComplete={onComplete} />}
    </div>
  );
}
