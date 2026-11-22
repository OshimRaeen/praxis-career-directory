# Praxis Career Atlas

Global Job Directory, Live Startup Job Board, and AI Career Roadmap Builder for the **Praxis Apprenticeship & Mentorship Platform** (`praxis.birthdaymessaging.io`).

## Features
- **Career Atlas:** Compare 9 career tracks across Full-Stack Development and HR & Recruitment with separate India (INR) and Global (USD) compensation bands, equity summaries, and role detail drawers.
- **Global Job Board:** Filter and sort 95 real Wellfound listings by role, region, work mode, disclosed equity, and verified annual pay, alongside Praxis partner and program modules.
- **AI Career Roadmap Builder:** Generates a 4-phase milestone roadmap tailored to a user's current stage, weekly commitment, and target role.

## Tech Stack
- Next.js (App Router) & TypeScript
- Tailwind CSS v4
- Motion (`motion/react`)
- Phosphor Icons (`@phosphor-icons/react`)
- Zod (`zod`)

## Local Setup
```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

> Adding `GROQ_API_KEY` or `GEMINI_API_KEY` to `.env.local` enables live AI roadmap generation. Without a key, the app uses a directory-grounded structured fallback automatically.

## Documentation
See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full technical architecture, data quality rules, and Phase 2 expansion plan.

---

### Final Verification, Commit & Deploy Checklist

1. **Type-check and production build** (catches any issue before Vercel does):
   ```bash
   npx tsc --noEmit
   npm run build
   ```