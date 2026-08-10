# Current State

Last updated: 2026-08-03
Repository: https://github.com/khan09faiz/portfolio_faiz
Production: main -> Vercel (portfolio-faiz-nu.vercel.app). Only `main` deploys.
main @ ea463c0 — everything below is merged and deployed.

Working copies (both in sync at ea463c0):
- ./portfolio_faiz                        — fully configured, DATABASE_URL set
- C:\Users\hp\OneDrive\Desktop\git\Me-myself-I — code complete, DATABASE_URL BLANK
  so it runs on the JSON fallback. Every git command there takes minutes because
  OneDrive syncs node_modules; excluding it would help.

## Source documents

Three overlapping zips exist. `Portfolio_Claude_Docs.zip` is the only one with
actionable detail — UI_DESIGN.md drove the theme, ADMIN_CMS/DATABASE/SECURITY/
AI_SYSTEM define the remaining work. The other two are placeholder scaffolding.

## Phases (IMPLEMENTATION_PLAN.md)

| # | Phase | State |
|---|-------|-------|
| 1 | Repository Audit | done |
| 2 | Authentication | done — Auth.js + GitHub, single-account allow-list |
| 3 | CMS Backend | PARTIAL — schema and reads only, no writes |
| 4 | Admin Dashboard | PARTIAL — read-only list views |
| 5 | Portfolio Integration | done — provider reads Postgres, verified end to end |
| 6 | AI Assistant | not started |
| 7 | Resume Studio | not started |
| 8 | LinkedIn Parser | not started |
| 9 | Samurai Redesign | done, live |
| 10 | Testing | NOT STARTED — no framework of any kind |
| 11 | Deployment | done |

## Completed

- Samurai theme: washi paper / sumi ink / vermillion, sumi-e motifs in every
  section, samurai + rising sun, brush cursor, ink ripple, brush-band headers.
- Production correctness: canonical URL unified (was three different dead
  domains), OG image 2.3MB -> 345KB, timezone bug in date formatting, 15 lint
  errors -> 0.
- Performance: backdrop-filter 29 -> 0 elements, style+layout+paint 71.4ms ->
  0.2ms, initial JS 559.8KB -> 326.7KB (three.js deferred behind an observer).
- Content layer: lib/content/ is the single read path, async, fetched in a
  server component. Content is absent from every client chunk.
- Database: Neon Postgres + Drizzle. 3 tables seeded with 21 rows. VERIFIED the
  app reads Postgres, not the JSON fallback, by renaming a row and confirming
  the marker appeared in the prerendered HTML.
- Admin: Auth.js GitHub sign-in, allow-list gate that fails closed, proxy.ts +
  layout double-gating, protected /admin with overview and read-only lists.

## Deviations from the spec — deliberate or noted

1. ADMIN_CMS.md says "hidden admin via easter egg". /admin is a plain route.
   Protected, noindex and robots-disallowed, but guessable. NOT implemented.
2. DATABASE.md lists 12 tables; 3 exist. certificates + experience are merged
   into timeline_items to match the existing JSON shape, and the `visibility`
   table is replaced by published/position columns. No `users` table — GitHub
   OAuth leaves nothing to store. Missing: profile, resumes, uploads, settings,
   chats, ai_history.
3. ADMIN_CMS.md lists 12 editable areas; the schema covers 3. Profile, About,
   Resume, Social Links, Images and Theme Settings are still hardcoded in
   lib/constants.ts.
4. SECURITY.md: rate limiting and audit logging are NOT implemented. Password
   hashing is not applicable — OAuth means no passwords exist.

## Next, in dependency order

1. CMS WRITES. The admin reads but cannot edit — the largest gap between what
   exists and what was asked for. Server actions + Zod validation + revalidatePath,
   because `/` is statically prerendered and edits will otherwise never reach the
   live site.
2. profile/settings tables, so lib/constants.ts becomes editable content.
3. A test framework, before any AI work. RAG on an untested CMS is how silent
   data corruption happens.
4. Then AI assistant, Resume Studio, LinkedIn parser.

## Known issues

Security:
- Neon password was pasted into a chat transcript on 2026-08-03 and MUST be
  rotated (Neon -> Connect -> Reset password). Data survives a rotation; update
  both .env.local files and Vercel afterwards.
- No rate limiting on /api/github or the contact form.
- No audit logging of admin actions.

Configuration:
- Vercel does NOT yet have DATABASE_URL or the AUTH_* variables, so production
  still serves the JSON fallback and /admin is inert. This is why nothing broke.
- The GitHub OAuth round trip has never been exercised — no credentials exist
  yet, so the sign-in page renders its "not configured" notice. That is the
  fail-safe path working, not proof the real flow succeeds.

Product:
- Editing content will not appear on the live site until revalidatePath is
  wired, because `/` is statically prerendered.
- CertificatesSection is still built but never rendered (absent from page.tsx
  and NAV_ITEMS).
- Dead code from the original audit remains: react-query installed with no
  provider, recharts and zustand unused, lib/utils/validation.ts dead and
  diverged from the inline schema in ContactSection.
- One documented eslint suppression in InteractiveCat (window.innerHeight is
  unavailable during SSR; the idiomatic fix restarts its rAF loop every render).
- 25 lint warnings, all no-unused-vars. Zero errors.
