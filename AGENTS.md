# AGENTS.md

Portable project brief for AI coding agents (Claude Code, Antigravity, Cursor,
or any tool that reads repo context). Everything an agent needs to work on this
codebase without re-deriving it.

**Read this first. Then `progress/CURRENT_STATE.md` if the spec repo is present.**

---

## 1. What this is

Mohammad Faiz Khan's portfolio — live at **https://portfolio-faiz-nu.vercel.app**.

It is being evolved from a static single-page portfolio into a **Portfolio
Operating System**: a hidden admin CMS, AI assistant, resume studio and job-hunt
tooling. The public site must stay fast and correct throughout.

**Owner:** khan09faiz (GitHub) · **Repo:** khan09faiz/portfolio_faiz

---

## 2. Non-negotiable rules

These come from the project spec and from mistakes already made here.

1. **Never commit directly to `main` without being asked.** `main`
   auto-deploys to production on Vercel. Branch first.
2. **Extend, do not rewrite.** Working code stays unless there is a stated
   reason to replace it.
3. **An animation must never be the thing that makes content visible.** This
   rule exists because a hydration error once froze an entrance animation and
   blanked the entire page below the hero. Content is visible in server HTML;
   motion only enhances.
4. **Verify against reality, not assumption.** Build it, run it, measure it,
   and say plainly what you could *not* verify.
5. **Never handle the user's credentials.** They go in `.env.local` (gitignored)
   or the Vercel dashboard. Do not ask for them in chat.
6. **Preserve UX, SEO, performance and accessibility.** Every change is checked
   for WCAG AA contrast and rendering cost.
7. **Headless CMS is the intended source of truth.** Content flows
   DB → `lib/content/provider.ts` → server component → props. Components must
   never read the datastore or JSON directly.

---

## 3. Stack

| | |
|---|---|
| Framework | Next.js 16.1.6, App Router, Turbopack, React Compiler |
| Runtime | React 19.2.3 |
| Language | TypeScript, `strict` |
| Styling | Tailwind 3.4 + CSS custom properties |
| Motion | Framer Motion, plus hand-rolled canvas |
| 3D | three / @react-three/fiber / drei — **lazy-loaded only** |
| Database | Neon Postgres (serverless) + Drizzle ORM |
| Auth | Auth.js v5 (next-auth beta) — GitHub OAuth |
| Hosting | Vercel |

---

## 4. Architecture, as built

```
app/page.tsx  (SERVER component)
   └── getHomeContent()  ──►  lib/content/provider.ts
                                   ├── DATABASE_URL set?  → Neon (published rows, by position)
                                   └── otherwise          → src/data/*.json  (fallback)
   └── passes content down as PROPS to client sections

app/admin/…            protected CMS  (proxy.ts + layout both gate it)
app/api/github/route.ts  GitHub GraphQL, revalidate 3600
```

**The JSON fallback is deliberate.** A portfolio that 500s because a serverless
database is asleep is worse than one showing slightly stale projects. A missing
`DATABASE_URL` is silent and expected; a *configured* database that fails is
logged as an error before falling back, so an outage never looks normal.

### Key directories

```
app/            routes; page.tsx is a server component
  admin/        (protected)/ route group + signin/ outside it
components/
  features/     page sections — all client components
  ui/           reusable UI, cursor, reveal, ripple
  ui/sumie/     original sumi-e SVG artwork + paths.ts
lib/
  content/      THE read path — provider, Zod schemas
  db/           Drizzle schema + Neon client
  hooks/        useReducedMotion, useMediaQuery
src/data/       JSON fallback content
drizzle/        migrations + seed.sql
scripts/        validate-content, seed, db-exec, generate-seed-sql
```

---

## 5. Landmines — read before touching these

Every one of these cost real debugging time. Do not rediscover them.

**Multi-line `d` attributes in JSX break hydration.**
`d="M 0 0⏎ L 10 10"` is whitespace-collapsed by the server compiler and
preserved by the client one. The mismatch aborts hydration for the whole tree.
All SVG path data lives in `components/ui/sumie/paths.ts` as **single-line**
constants. Keep it that way; do not let a formatter wrap them.

**`transform` and `clip-path` create containing blocks for `position: fixed`.**
The section reveal animates both. Any `fixed` element inside a revealed section
sizes itself to that section, not the viewport, and gets clipped by its
`overflow-hidden`. `InkReveal` strips its class on `animationend` for this
reason, and modals render through a **portal to `document.body`**.

**A barrel re-export defeats `next/dynamic`.**
`components/features/skills/index.ts` must NOT re-export `SkillsGlobe`. Doing so
pulls three/fiber/drei (233 KB gz) into the initial bundle even though
`SkillsSection` imports it dynamically.

**`mix-blend-mode` on a viewport-sized layer destroys scroll performance.**
It takes the browser off the fast compositor path, re-compositing the whole
screen every frame. The paper texture bakes its alpha into the PNG instead.
Measured: 71.4 ms → 0.2 ms per style/layout/paint cycle.

**`backdrop-filter` is expensive at scale.** 29 elements had it; removing them
was the single biggest rendering win. Surfaces are flat paper now.

**`drizzle-kit push` needs an interactive TTY** and aborts in scripts/CI/agents.
Use `npm run db:exec -- <file.sql>` instead.

**`sharp(buf).toFile()` re-encodes and discards palette optimisation.** Write
optimised buffers with `fs.writeFileSync`, or a 121 KB PNG silently becomes
184 KB.

**A page inside `app/admin/` inherits the auth-gating layout.** The sign-in page
must stay outside the `(protected)` route group, or signing in requires already
being signed in — an infinite redirect.

---

## 6. Theme

Washi paper / sumi ink / vermillion. Japanese sumi-e, not "dark mode with red".

All colour resolves through CSS custom properties in `app/globals.css` —
**never hard-code a hex in a component or in `tailwind.config.ts`.**

```
--paper 253 252 250   --sumi 26 24 22     --vermillion 191 42 34
--gold  166 132 56    --sakura 233 168 185
```

A dormant `:root[data-ink='bold']` variant exists; setting that attribute
switches to a crimson-led palette. Keep both AA-compliant if you touch colour.

Motion honours `prefers-reduced-motion` in CSS **and** via
`lib/hooks/useReducedMotion.ts` for JS-driven motion, which CSS cannot reach.

---

## 7. Commands

```bash
npm run dev               # dev server
npm run build             # production build — the real gate
npm run lint              # 0 errors expected; ~25 no-unused-vars warnings are pre-existing
npm run validate:content  # Zod-validates src/data/*.json
npm run db:exec -- f.sql  # apply SQL non-interactively (use instead of db:push)
npm run db:seed           # seed DB from JSON (idempotent upserts)
npm run db:seed:sql       # emit drizzle/seed.sql for pasting into Neon's console
```

**Definition of done for any change:** build green · lint no *new* errors ·
content gate passes · verified in a browser against a production build, not dev.

---

## 8. Environment

`.env.local` (gitignored) locally; Vercel dashboard in production.

| Variable | Effect if blank |
|---|---|
| `DATABASE_URL` | Site reads `src/data/*.json`. Not an error. |
| `AUTH_GITHUB_ID` / `_SECRET` / `AUTH_SECRET` | `/admin` gated, sign-in shows "not configured" |
| `ADMIN_GITHUB_LOGIN` | **Nobody** can sign in — the gate fails closed |
| `GITHUB_TOKEN` | `/api/github` returns 500 |
| `NEXT_PUBLIC_EMAILJS_*` | Contact form runs in demo mode |

**Security model:** GitHub proves *identity*; it does not grant access. The
`signIn` callback in `auth.ts` compares the login against `ADMIN_GITHUB_LOGIN`
and refuses everyone else. It fails **closed** — an unset allow-list admits
nobody, never everybody.

---

## 9. Status

Done: repository audit · Samurai redesign · production correctness fixes ·
performance pass · async server-side content layer · Neon schema seeded and
**verified reading from Postgres** · Auth.js admin with read-only views.

Partial: CMS backend (reads only, **no writes**) · admin dashboard (read-only).

Not started: AI assistant (RAG) · Resume Studio · LinkedIn parser ·
**any test framework** · rate limiting · audit logging.

### Known deviations from the spec

1. `ADMIN_CMS.md` specifies "hidden admin via easter egg". `/admin` is a plain
   guessable route — protected, `noindex`, robots-disallowed, but **not hidden**.
2. `DATABASE.md` lists 12 tables; 3 exist. `certificates` + `experience` are
   merged into `timeline_items` to match the existing JSON; `visibility` is
   replaced by `published`/`position` columns. No `users` table — OAuth leaves
   nothing to store.
3. Profile, About, Resume, Social Links, Images and Theme Settings are still
   hardcoded in `lib/constants.ts` rather than being editable content.

### Next, in dependency order

1. **CMS writes** — server actions + Zod + `revalidatePath('/')`. Without
   revalidation an edit never reaches the live site, because `/` is statically
   prerendered.
2. `profile`/`settings` tables, so `lib/constants.ts` becomes editable.
3. **A test framework** — before any AI work. RAG on an untested CMS is how
   silent data corruption happens.
4. AI assistant → Resume Studio → LinkedIn parser.

---

## 10. Working agreement

- One feature per branch; explain the plan before large changes.
- State what you verified **and what you did not**. "Should work" is not a status.
- If a spec instruction seems wrong, say so once, then follow it unless
  overruled.
- Update `progress/CURRENT_STATE.md` when the spec repo is available.
