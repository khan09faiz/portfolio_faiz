# CLAUDE.md — Project Guidelines

**The full brief is [AGENTS.md](./AGENTS.md). Read it first.** It is kept
tool-agnostic so Claude Code, Antigravity and any other agent share one context
instead of drifting apart. This file holds the day-to-day conventions.

## Project overview

`portfolio_faiz` (also cloned as `Me-myself-I`) — a developer portfolio being
evolved into a Portfolio Operating System: hidden admin CMS, AI assistant,
resume studio, job-hunt tooling. Live at portfolio-faiz-nu.vercel.app; `main`
auto-deploys, so branch before you work.

## Essential commands

### Development
- `npm run dev` — local dev server
- `npm run build` — production build. **This is the real gate.**
- `npm run start` — serve the production build

### Quality
- `npm run lint` — 0 errors expected; ~25 `no-unused-vars` warnings are pre-existing
- `npm run validate:content` — Zod-validates `src/data/*.json`

### Database (Drizzle + Neon)
- `npm run db:generate` — generate migrations from `lib/db/schema.ts`
- `npm run db:exec -- <file.sql>` — apply SQL **non-interactively**
- `npm run db:seed` — seed from JSON (idempotent upserts)
- `npm run db:seed:sql` — emit `drizzle/seed.sql` for pasting into Neon's console
- `npm run db:studio` — Drizzle Studio
- `npm run db:push` — ⚠ requires an interactive TTY; **fails in scripts, CI and
  agent sessions.** Use `db:exec` instead.

## Tech stack

- **Framework** Next.js 16 App Router, Turbopack, React Compiler, React 19
- **Styling** Tailwind CSS + CSS custom properties, Lucide icons, Framer Motion
- **3D** three / @react-three/fiber / drei — **lazy-loaded, never in the initial bundle**
- **Data** Drizzle ORM + Neon serverless Postgres, with a JSON fallback
- **Auth** Auth.js v5 (`auth.ts`, `proxy.ts`) — GitHub OAuth, single-account allow-list
- **Forms** React Hook Form + Zod

> Note: `zustand`, `@tanstack/react-query` and `recharts` are installed but
> **not used** — no provider is mounted and nothing imports them. Treat them as
> dead dependencies, not as the state layer.

## Conventions

- **TypeScript** strict. Avoid `any`. Zod for anything crossing a boundary.
- **Server components by default.** Add `"use client"` only when interactivity
  demands it. `app/page.tsx` is a server component and fetches content.
- **Content flows one way:** DB → `lib/content/provider.ts` → server component →
  props. Components must never read the datastore or `src/data/*.json` directly.
- **Colour comes from CSS custom properties** in `app/globals.css`. Never
  hard-code a hex in a component or in `tailwind.config.ts`.
- **Styling** utility-first Tailwind; compose with the `cn` helper
  (`clsx` + `tailwind-merge`).
- **Imports** use the `@/*` path aliases from `tsconfig.json`.
- **Env vars** live in `.env.local` (gitignored) or the Vercel dashboard. Never
  commit a secret, never prefix one with `NEXT_PUBLIC_`.
- **Motion** must honour `prefers-reduced-motion` — in CSS *and* via
  `lib/hooks/useReducedMotion.ts` for JS-driven motion.

## Three things that will bite you

Full list in AGENTS.md §5. The ones that cost the most time here:

1. SVG path `d` attributes must stay **single-line** — the server compiler
   collapses multi-line whitespace and the client preserves it, which aborts
   hydration for the whole page.
2. `transform` / `clip-path` on a section make `position: fixed` children
   resolve against **that section**, not the viewport. Modals portal to
   `document.body`.
3. Never re-export `SkillsGlobe` from the skills barrel — it drags 233 KB of
   three.js into the initial bundle and silently defeats `next/dynamic`.
