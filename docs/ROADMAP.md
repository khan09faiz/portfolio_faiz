# Build Roadmap

The complete plan, from where the project is now to everything the spec
describes. Derived from `docs/vision/` and the audit of the actual codebase.

**Status legend:** ✅ done · 🟡 partial · ⬜ not started

---

## Where things stand

| # | Phase | Status | Notes |
|---|-------|--------|-------|
| 1 | Repository audit | ✅ | Findings in `progress/CURRENT_STATE.md` |
| 2 | Authentication | ✅ | Auth.js + GitHub, single-account allow-list |
| 3 | CMS backend | 🟡 | Schema + reads. **No writes.** |
| 4 | Admin dashboard | 🟡 | Read-only list views |
| 5 | Portfolio integration | ✅ | Provider reads Postgres, verified end-to-end |
| 6 | AI assistant | ⬜ | |
| 7 | Resume studio | ⬜ | |
| 8 | LinkedIn parser | ⬜ | |
| 9 | Samurai redesign | ✅ | Live |
| 10 | Testing | ⬜ | **No framework at all** |
| 11 | Deployment | ✅ | Vercel, `main` auto-deploys |

Out of the 10 modules in `PRODUCT_VISION.md`: **3 done** (Editable Portfolio
plumbing, GitHub Sync, Samurai UI), **1 partial** (Hidden Admin CMS),
**6 not started**.

---

## Phase A — CMS writes  ◀ NEXT

Turns a read-only admin into an actual CMS. The single largest gap between what
exists and what `ADMIN_CMS.md` describes.

**Build**
- Server actions for create / update / delete on `projects`, `skill_categories`,
  `timeline_items`
- Zod validation reusing `lib/content/schemas.ts`, so the admin and the content
  gate cannot disagree about what is valid
- `revalidatePath('/')` after every write
- Publish / unpublish toggle; reordering via the existing `position` column
- Optimistic UI with rollback on failure

**Two things that will break it if ignored**
1. **`/` is statically prerendered.** Without `revalidatePath`, a save succeeds
   and the visitor keeps seeing old content forever. This is the whole reason
   the phase is not just "add a form".
2. **Every action must re-check the session.** `proxy.ts` guards *navigation*.
   A POST to a server action does not pass through it, so an unauthenticated
   request could otherwise mutate content directly.

**Done when:** an edit in the admin appears on `/` without a redeploy · every
action validated and independently session-checked · verified against the real
database, not the JSON fallback.

---

## Phase B — Profile, settings, ordering

`ADMIN_CMS.md` lists 12 editable areas. Three are covered. This closes most of
the rest.

**Build**
- `profile` table — name, title, bio, location, social links, contact
- `settings` table — theme intensity, feature flags, visibility toggles
- Migrate `lib/constants.ts` (currently hardcoded) into those tables
- Keep the same JSON-fallback pattern so nothing hard-fails

**Note:** this is what makes About, Social Links and Theme Settings editable
without code — the stated goal of `PRODUCT_VISION.md`.

---

## Phase C — Testing  ◀ do before any AI work

`IMPLEMENTATION_PLAN.md` phase 10. There is currently **no test framework**.

**Build**
- Vitest + Testing Library for units and components
- Playwright for a small end-to-end set: admin sign-in gate, a content edit
  reaching the public page, the JSON fallback engaging when the DB is absent
- Content-schema tests so a malformed row cannot reach production
- Wire into CI on pull requests

**Why here and not later:** RAG on top of an untested CMS is how silent data
corruption happens. Every phase after this one writes or reads content
programmatically.

---

## Phase D — Asset manager

`ARCHITECTURE.md` specifies `Frontend -> API -> Database -> Object Storage`.
No storage layer exists.

**Build**
- Object storage (Vercel Blob, or S3-compatible)
- `uploads` table for metadata
- Admin upload UI with drag-and-drop, `next/image` optimisation
- Attach images to projects and the profile

**Constraint:** the OG image was 2.3 MB before it was fixed. Enforce size and
dimension limits at upload, or the same problem returns through the CMS.

---

## Phase E — Public AI assistant (RAG)

From `AI_SYSTEM.md`: answers **only** from portfolio, resume, GitHub, LinkedIn,
certificates, projects, skills, experience. Rejects unrelated questions.

**Build**
- `pgvector` on Neon for embeddings
- Indexer over published content; re-index on CMS write
- Retrieval + grounded generation, refusing anything unsupported by context
- Chat UI in the samurai theme
- `chats` / `ai_history` tables

**Non-negotiables**
- **Rate limiting.** A public LLM endpoint without it is an unmetered bill.
  `SECURITY.md` already requires this and it is not implemented.
- **Grounding.** The assistant must decline rather than invent. It speaks as
  the portfolio owner; a hallucinated claim about experience is a real-world
  problem, not a UX blemish.
- Never expose unpublished content through retrieval.

---

## Phase F — Resume studio

From `13_RESUME_STUDIO.md` and `AI_SYSTEM.md`: tailors resumes using **verified
profile data only**.

**Build**
- `resumes` table with a master resume plus variants
- AI tailoring constrained to stored facts — no invention
- PDF / DOCX export
- Version history

---

## Phase G — LinkedIn PDF import

**Build**
- Upload and parse a LinkedIn profile export
- Map to `profile` / `timeline_items`
- **Review-before-apply diff.** Never write parsed data straight into the CMS;
  parsers misread, and silent overwrites of good content are unrecoverable.

---

## Phase H — Job hunt AI

From `14_JOB_HUNT.md`. Job tracking, match scoring against the profile,
tailored applications. Depends on E and F.

---

## Cross-cutting, unfinished

| Item | Source | State |
|---|---|---|
| Rate limiting | `SECURITY.md` | ⬜ Needed before any public AI endpoint |
| Audit logging | `SECURITY.md` | ⬜ No record of admin actions |
| Hidden admin easter egg | `ADMIN_CMS.md` | ⬜ `/admin` is a plain guessable route |
| Version history | `PRODUCT_VISION.md` | ⬜ No content history |
| Dead code removal | audit | ⬜ react-query, recharts, zustand unused |
| `CertificatesSection` | audit | ⬜ Built but never rendered |

---

## Deviations from the spec, stated plainly

1. **`DATABASE.md` lists 12 tables; 3 exist.** `certificates` + `experience` are
   merged into `timeline_items` to match the existing JSON shape, and the
   `visibility` table is replaced by `published` / `position` columns. No `users`
   table — GitHub OAuth leaves nothing to store. Remaining: `profile`,
   `resumes`, `uploads`, `settings`, `chats`, `ai_history`.
2. **The admin is not hidden.** `ADMIN_CMS.md` asks for an easter egg. `/admin`
   is protected, `noindex`'d and robots-disallowed, but guessable.
3. **No object storage.** `ARCHITECTURE.md` ends at Object Storage; Phase D.
4. **Password hashing is not applicable.** `SECURITY.md` lists it, but OAuth
   means no passwords exist to hash. This is stronger, not weaker.

---

## Sequencing

```
A (CMS writes)  ─►  B (profile/settings)  ─►  C (testing)  ─┬─►  D (assets)
                                                            ├─►  E (AI/RAG)  ─►  F (resume)  ─►  H (job hunt)
                                                            └─►  G (LinkedIn import)
```

A and B are prerequisites for everything. C gates the AI phases deliberately.
D, E and G can run in parallel afterwards.

**Per phase, per `IMPLEMENTATION_PLAN.md`:** explain → plan → wait for approval →
implement → test → report.
