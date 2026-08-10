# Current Task

Nothing in progress. main @ ea463c0 is merged and deployed.

## Proposed next: CMS writes (Phase 3/4 completion)

Objective:
Make the admin actually edit. It currently reads Postgres and renders lists, but
nothing can be changed — the largest gap between what exists and what
ADMIN_CMS.md describes.

Scope:
- Server actions for create/update/delete on projects, skill_categories and
  timeline_items, each re-checking the session (proxy.ts guards navigation, not
  mutations — a POST must not rely on someone having passed through a page).
- Zod validation on every input, reusing lib/content/schemas.ts so the admin and
  the content gate cannot disagree about what is valid.
- revalidatePath('/') after each write. Without it nothing reaches the live
  site: `/` is statically prerendered, so a save would appear to succeed and the
  visitor would keep seeing the old content indefinitely.
- Publish/unpublish toggle and drag-free ordering via the existing position
  column.

Out of scope for this phase:
- profile/settings tables (the next phase — that is what unlocks the rest of the
  ADMIN_CMS list).
- Image uploads. Needs an object store; docs/ARCHITECTURE.md says
  Frontend -> API -> Database -> Object Storage, and no storage exists yet.
- Anything AI.

Definition of Done:
- [ ] Create, edit, delete and publish/unpublish work for all three entities
- [ ] Every action validated with Zod and session-checked independently
- [ ] An edit made in the admin is visible on `/` without a redeploy
- [ ] Build green, lint no new errors, content gate passes
- [ ] Verified against the real database, not just the JSON fallback

## Blocked on you

- Rotate the Neon password (exposed in a transcript on 2026-08-03).
- Add DATABASE_URL + AUTH_GITHUB_ID + AUTH_GITHUB_SECRET + AUTH_SECRET +
  ADMIN_GITHUB_LOGIN to Vercel, then redeploy. Until then production serves JSON
  and /admin is inert.
- Create the GitHub OAuth app so the sign-in flow can actually be tested.

## Not implemented, from the spec

- "Hidden admin via easter egg" (ADMIN_CMS.md) — /admin is a plain, guessable
  route. Protected and noindex'd, but not hidden.
- Rate limiting, audit logging (SECURITY.md).
- No test framework at all (IMPLEMENTATION_PLAN phase 10). Worth doing before
  the AI phases.
