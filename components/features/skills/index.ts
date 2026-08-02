export { SkillsSection } from './SkillsSection'

/*
  SkillsGlobe is deliberately NOT re-exported here.

  page.tsx imports SkillsSection from this barrel. Re-exporting SkillsGlobe put
  it in the same module graph, so three / @react-three/fiber / drei — 233KB —
  were pulled into the initial bundle on every visit, and the dynamic import
  inside SkillsSection did nothing at all.

  Import it by path if it is ever needed directly.
*/
