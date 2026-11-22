# Praxis Career Atlas — Product & Technical Specification

**Owner:** Oshim Raeen  
**Stakeholders:** Alex Dalley (Product), Jia Sheng Tan (Tech Lead), Edgar Feliciano (HR & Curriculum)  
**Status:** Phase 1 MVP 

## 1. Purpose
The Praxis Career Atlas gives prospective and active apprentices a clear view of real-world job outcomes—starting pay, typical compensation ranges, startup equity stakes, core skills, and career progression—paired with a browseable job board and an interactive AI roadmap planner.

## 2. Core Modules
1. **Career Atlas (Directory View)**
   - 9 role profiles across **Full-Stack Development** (4 roles) and **HR & Recruitment** (5 roles).
   - Separate **India (INR)** and **Global (USD)** market views so local purchasing power is not distorted by raw FX conversion.
   - Self-scaled `Lowest → Typical Avg → Highest` pay bars and slide-over role drawers with responsibilities, skills, next roles, and sample listings.
2. **Global Job Board (95 Listings)**
   - Multi-facet filtering by search query, role category, region, work mode, disclosed equity, and verified annual pay.
   - Transparent data-quality badges (`Verify pay period`, `Assumed USD`, `Intern pay check`, `Commission-based`) so apprentices never mistake unverified figures for guarantees.
   - **Monetization & Growth Hooks:** Dedicated Partner Spotlight slot, Praxis Apprenticeship ($97/mo) conversion card, Career Advisory CTA, and Hiring Partner inquiry link.
3. **AI Career Roadmap Builder**
   - `POST /api/roadmap` validated with `zod`.
   - Grounded in `roles.json` skills and responsibilities; supports Groq or Gemini via environment variables with a deterministic fallback so the workflow never fails offline.

## 3. Tech Stack & Project Structure
- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 with custom Praxis `@theme` tokens (`#102A43` navy, `#E75A0F` orange, `#C37450` clay, `#4A94BF` cerulean)
- **Motion & Icons:** `motion/react` (shared-element `layoutId` springs & clip-path drawers) + `@phosphor-icons/react`
- **Data Layer:** Normalized static JSON (`src/data/roles.json`, `src/data/listings.json`) generated from `career_outcome_database (1).xlsx` (collected Nov 15–18, 2026 from public Wellfound pages).

## 4. Known Data Limitations (Phase 1)
- Several HR categories (`HR Business Partner`, `HR Operations Specialist`, `Technical Recruiter`) and `Software Engineer` currently have fewer than 10 paid listings; these are explicitly flagged with low-sample notices in the UI.
- Only skills named in listing titles were captured from public list pages; general role skills are clearly labeled as career guidance.

## 5. Phase 2 Expansion Plan
- Add **DevOps**, **Accounting**, and **Business** tracks (already surfaced as upcoming categories).
- Connect listings to a database (PostgreSQL / ERPNext / HR Workflow API) once Gitea and self-hosted infrastructure are finalized.
- Enable employer self-serve submissions for sponsored Partner Spotlight listings.