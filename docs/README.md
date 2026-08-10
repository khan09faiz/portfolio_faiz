# Documentation

Everything specifying this project, now living in the repo so it travels with
the code and any agent — Claude Code, Antigravity, or otherwise — finds it.

## Start here

| File | What it is |
|---|---|
| **[../AGENTS.md](../AGENTS.md)** | Portable brief for coding agents. **Read first.** Architecture, conventions, and the landmines that already cost debugging time. |
| **[ROADMAP.md](./ROADMAP.md)** | The whole build — every phase from here to the finished Portfolio OS, with sequencing and acceptance criteria. |
| [../progress/CURRENT_STATE.md](../progress/CURRENT_STATE.md) | What is actually built right now, and every known issue. |
| [../tasks/CURRENT_TASK.md](../tasks/CURRENT_TASK.md) | The task in flight. |

## Specification

`vision/` — the substantive specification. These define what is being built.

- [PRODUCT_VISION.md](./vision/PRODUCT_VISION.md) — the 10 modules
- [ARCHITECTURE.md](./vision/ARCHITECTURE.md) — Frontend → API → DB → Object Storage
- [IMPLEMENTATION_PLAN.md](./vision/IMPLEMENTATION_PLAN.md) — the 11 phases
- [ADMIN_CMS.md](./vision/ADMIN_CMS.md) — what must be editable
- [DATABASE.md](./vision/DATABASE.md) — intended tables
- [SECURITY.md](./vision/SECURITY.md) — security requirements
- [AI_SYSTEM.md](./vision/AI_SYSTEM.md) — RAG assistant, admin AI, resume AI
- [UI_DESIGN.md](./vision/UI_DESIGN.md) — the samurai theme brief
- [FUTURE_IDEAS.md](./vision/FUTURE_IDEAS.md) — beyond the roadmap

`spec/` — the 21-file design-specification set. Mostly one-line intent
statements rather than detailed designs; treat `vision/` as authoritative where
the two disagree.

[START_SESSION.md](./START_SESSION.md) — the original session protocol.

## Provenance

These came from three overlapping uploads: `Portfolio_Engineering_Design_Specification.zip`
(now `spec/`), `Portfolio_Claude_Docs.zip` (now `vision/`) and
`Portfolio_Engineering_Knowledge_Base.zip` (a third stub set adding nothing the
other two lacked).

Five files in `vision/` — PRODUCT_VISION, ARCHITECTURE, UI_DESIGN,
IMPLEMENTATION_PLAN, FUTURE_IDEAS — are marked as reconstructed. Their source
zip was removed from disk before consolidation; the content is verbatim as read
on 2026-08-02, with only a provenance note added. The other four are the
original files.

## Keeping this honest

- Update `progress/CURRENT_STATE.md` at the end of a working session.
- Record deviations from the spec in `ROADMAP.md` rather than quietly diverging.
- When a landmine costs real time, add it to `AGENTS.md` §5 so nobody
  rediscovers it.
