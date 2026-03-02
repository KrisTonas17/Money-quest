import { createRng, pickRandom } from "./rng";
import type { SessionContent, DecisionCardData, MiniGameType } from "@/types/game";

function getLessonPack(sessionId: number) {
  const packs: Record<number, any> = {
    1: require("@/../data/lessons/lesson-1.json"),
    2: require("@/../data/lessons/lesson-2.json"),
    3: require("@/../data/lessons/lesson-3.json"),
    4: require("@/../data/lessons/lesson-4.json"),
    5: require("@/../data/lessons/lesson-5.json"),
    6: require("@/../data/lessons/lesson-6.json"),
    7: require("@/../data/lessons/lesson-7.json"),
    8: require("@/../data/lessons/lesson-8.json"),
  };
  return packs[sessionId];
}

function fillPlaceholders(text: string, rng: () => number): string {
  const names = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley"];
  const items = ["limited edition sneakers", "new game controller", "concert tickets", "bubble tea", "mystery box"];
  const amounts = ["$20", "$50", "$35", "$15", "$75"];
  return text
    .replace(/{name}/g, pickRandom(names, rng))
    .replace(/{item}/g, pickRandom(items, rng))
    .replace(/{amount}/g, pickRandom(amounts, rng));
}

export function generateSessionContent(sessionId: number, seed: string): SessionContent {
  const rng = createRng(`${seed}-session-${sessionId}`);
  const pack = getLessonPack(sessionId);

  const storyPrompt = pickRandom<string>(pack.storyPrompts, rng);
  const storyText = fillPlaceholders(storyPrompt, rng);

  const cardTemplate = pickRandom<any>(pack.decisionCards, rng);
  const decisionCard: DecisionCardData = {
    id: `${pack.id}-${cardTemplate.id}`,
    scenario: fillPlaceholders(cardTemplate.scenario, rng),
    context: fillPlaceholders(cardTemplate.context || "", rng),
    choices: cardTemplate.choices.map((c: any) => ({
      ...c,
      description: fillPlaceholders(c.description, rng),
    })),
  };

  const miniGameTypes: MiniGameType[] = ["bucket-sprint", "checkout-chaos", "ownership-orchard"];
  const miniGameType: MiniGameType = miniGameTypes[(sessionId - 1) % 3];

  return {
    lessonId: sessionId,
    title: pack.title,
    storyText,
    learningObjectives: pack.learningObjectives,
    decisionCard,
    miniGameType,
    miniGameModifiers: pack.miniGameModifiers,
  };
}

export function generateBossChallenge(week: number, seed: string) {
  const rng = createRng(`${seed}-boss-${week}`);
  const sessionId = week * 2;
  const pack = getLessonPack(sessionId);

  const templates = pack.bossChallengeTemplates || pack.decisionCards.slice(0, 3);
  const cards = templates.slice(0, 3).map((t: any) => ({
    ...t,
    scenario: fillPlaceholders(t.scenario, rng),
    context: fillPlaceholders(t.context || "", rng),
    choices: t.choices.map((c: any) => ({
      ...c,
      description: fillPlaceholders(c.description, rng),
    })),
  }));

  const forecastTemplates = pack.realityRemix?.forecasts || [
    "The financial winds are shifting. Discipline now and you'll find smoother seas ahead.",
    "Your temptation meter was high this week — expect more enticing offers next week. Stay sharp!",
    "You crushed the saving streak! Your future self sends a high-five.",
    "Investment opportunities are stirring. Keep that courage trait high!",
  ];
  const forecast = fillPlaceholders(pickRandom<string>(forecastTemplates, rng), rng);

  return { cards, forecast };
}
