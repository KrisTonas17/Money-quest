import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameState, Effects } from "@/types/game";

const INITIAL_STATE: GameState = {
  seed: "42",
  mode: "story",
  week: 1,
  session: 1,
  buckets: { spend: 50, save: 20, invest: 10 },
  traits: { discipline: 30, awareness: 30, patience: 30, courage: 30, ownership: 30 },
  streak: 0,
  temptation: 20,
  netWorthHistory: [{ session: 0, value: 80 }],
  completedSessions: [],
  achievements: [],
  playerName: "Player",
  coachMode: false,
};

interface GameStore {
  gameState: GameState;
  startNewRun: (seed: string, mode: GameState["mode"]) => void;
  loadRun: () => void;
  hasSavedRun: () => boolean;
  applyDecision: (effects: Effects) => void;
  completeSession: (sessionId: number, miniGameScore: number) => void;
  setPlayerName: (name: string) => void;
  toggleCoachMode: () => void;
}

function clamp(val: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, val));
}

function checkAchievements(state: GameState): string[] {
  const achievements = [...state.achievements];
  if (state.streak >= 5 && !achievements.includes("streak-master")) achievements.push("streak-master");
  if (state.traits.ownership >= 70 && !achievements.includes("owner-mindset")) achievements.push("owner-mindset");
  if (state.temptation <= 10 && !achievements.includes("impulse-slayer")) achievements.push("impulse-slayer");
  if (state.buckets.invest >= 200 && !achievements.includes("goal-crusher")) achievements.push("goal-crusher");
  return achievements;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      gameState: INITIAL_STATE,

      startNewRun: (seed, mode) => {
        set({
          gameState: {
            ...INITIAL_STATE,
            seed,
            mode,
            netWorthHistory: [{ session: 0, value: 80 }],
          },
        });
      },

      loadRun: () => {
        // persisted automatically by zustand/persist
      },

      hasSavedRun: () => {
        const { gameState } = get();
        return gameState.completedSessions.length > 0;
      },

      applyDecision: (effects: Effects) => {
        set((state) => {
          const g = state.gameState;
          const newBuckets = {
            spend: Math.max(0, g.buckets.spend + (effects.spend || 0)),
            save: Math.max(0, g.buckets.save + (effects.save || 0)),
            invest: Math.max(0, g.buckets.invest + (effects.invest || 0)),
          };
          const newTraits = {
            discipline: clamp(g.traits.discipline + (effects.discipline || 0)),
            awareness: clamp(g.traits.awareness + (effects.awareness || 0)),
            patience: clamp(g.traits.patience + (effects.patience || 0)),
            courage: clamp(g.traits.courage + (effects.courage || 0)),
            ownership: clamp(g.traits.ownership + (effects.ownership || 0)),
          };
          const newTemptation = clamp(g.temptation + (effects.temptation || 0));
          const newStreak = (effects.streak || 0) > 0 ? g.streak + 1 : effects.streak === -1 ? 0 : g.streak;

          return {
            gameState: {
              ...g,
              buckets: newBuckets,
              traits: newTraits,
              temptation: newTemptation,
              streak: newStreak,
            },
          };
        });
      },

      completeSession: (sessionId, miniGameScore) => {
        set((state) => {
          const g = state.gameState;
          const netWorth = g.buckets.spend + g.buckets.save + g.buckets.invest;
          const bonus = Math.floor(miniGameScore / 10);
          const newInvest = g.buckets.invest * 1.02; // 2% growth each session
          const newHistory = [...g.netWorthHistory, { session: sessionId, value: netWorth + bonus }];
          const newCompleted = [...g.completedSessions, sessionId];
          const newSession = sessionId % 2 === 0 ? 1 : 2;
          const newWeek = sessionId % 2 === 0 ? Math.min(4, g.week + 1) : g.week;
          const newAchievements = checkAchievements({ ...g, buckets: { ...g.buckets, invest: newInvest } });

          return {
            gameState: {
              ...g,
              buckets: { ...g.buckets, invest: newInvest },
              completedSessions: newCompleted,
              netWorthHistory: newHistory,
              week: newWeek,
              session: newSession,
              achievements: newAchievements,
            },
          };
        });
      },

      setPlayerName: (name) => set((s) => ({ gameState: { ...s.gameState, playerName: name } })),
      toggleCoachMode: () => set((s) => ({ gameState: { ...s.gameState, coachMode: !s.gameState.coachMode } })),
    }),
    {
      name: "money-quest-v1",
    }
  )
);
