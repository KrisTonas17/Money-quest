export interface Buckets {
  spend: number;
  save: number;
  invest: number;
}

export interface Traits {
  discipline: number;
  awareness: number;
  patience: number;
  courage: number;
  ownership: number;
}

export interface Effects {
  spend?: number;
  save?: number;
  invest?: number;
  discipline?: number;
  awareness?: number;
  patience?: number;
  courage?: number;
  ownership?: number;
  temptation?: number;
  streak?: number;
}

export interface Choice {
  label: string;
  description: string;
  emoji: string;
  effects: Effects;
  opportunityCost?: string;
}

export interface DecisionCardData {
  id: string;
  scenario: string;
  context: string;
  choices: Choice[];
}

export interface GameState {
  seed: string;
  mode: "story" | "family" | "endless";
  week: number;
  session: number;
  buckets: Buckets;
  traits: Traits;
  streak: number;
  temptation: number;
  netWorthHistory: { session: number; value: number }[];
  completedSessions: number[];
  achievements: string[];
  playerName: string;
  coachMode: boolean;
}

export type MiniGameType = "bucket-sprint" | "checkout-chaos" | "ownership-orchard";

export interface SessionContent {
  lessonId: number;
  title: string;
  storyText: string;
  learningObjectives: string[];
  decisionCard: DecisionCardData;
  miniGameType: MiniGameType;
  miniGameModifiers: Record<string, any>;
}
