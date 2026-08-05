# CLAUDE.md

The full project brief lives in **[AGENTS.md](./AGENTS.md)** — read that first.

It is kept tool-agnostic on purpose so Claude Code, Antigravity and any other
agent work from the same context rather than drifting apart. This file exists
only so Claude Code finds it; put project knowledge in AGENTS.md, not here.

## Quick reference

```bash
npm run build             # the real gate — must be green
npm run lint              # 0 errors; ~25 pre-existing warnings are fine
npm run validate:content  # Zod-validates src/data/*.json
```

Three things that will bite you if you skip AGENTS.md §5:

- SVG path `d` attributes must stay **single-line** or hydration breaks.
- `transform`/`clip-path` on a section makes `position: fixed` children resolve
  against it — modals must portal to `document.body`.
- Never re-export `SkillsGlobe` from the skills barrel; it drags three.js into
  the initial bundle.
