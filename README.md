# Money Quest: The Owner's Path

A browser-based financial literacy game for families and individuals. 8 sessions, 4 weeks, real lessons about money.

## Features
- 8 lesson sessions with story scenes, decision cards, and mini-games
- 3 mini-games: Bucket Sprint, Checkout Chaos, Ownership Orchard
- 5 trait system: Discipline, Awareness, Patience, Courage, Ownership
- Money buckets: Spend, Save, Invest
- Temptation meter + Pay Yourself First streak
- Net worth charting with Recharts
- Achievements system
- Reality Remix forecasts after each week
- Seeded runs via `?seed=1234` URL parameter
- Family League comparison via export codes
- No database, no auth — all localStorage via Zustand persist

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to Vercel for auto-deploy on push.

## Sharing a Run

1. Go to Dashboard → click **"Click to copy run code"**
2. Share the code with family
3. They paste it at `/family` to compare results

## Sharing a Seed

Add `?seed=1234` to any URL. Everyone with the same seed plays identical scenarios.

Example: `https://your-app.vercel.app/?seed=familygame2024`

## Project Structure

```
src/
  app/               # Next.js App Router pages
    page.tsx         # Home / mode select
    dashboard/       # Stats dashboard
    session/[id]/    # Session gameplay
    boss/[week]/     # Boss challenge
    family/          # Family league compare
  components/        # UI components
    minigames/       # BucketSprint, CheckoutChaos, OwnershipOrchard
  lib/               # engine.ts (content gen) + rng.ts (seeded RNG)
  store/             # Zustand game state
  types/             # TypeScript interfaces
data/
  lessons/           # JSON lesson packs (lesson-1.json through lesson-8.json)
```

## Adding New Content

Edit any `data/lessons/lesson-X.json` to add new `decisionCards`, `storyPrompts`, or `bossChallengeTemplates`. No code changes required — the engine picks randomly from the arrays using the seed.
