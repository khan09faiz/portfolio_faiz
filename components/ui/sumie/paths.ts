/**
 * SVG path data for the sumi-e motifs.
 *
 * These live here as SINGLE-LINE string constants for a specific reason: a
 * multi-line string literal inside a JSX attribute (`d="M 0 0\n   L 10 10"`)
 * is whitespace-collapsed by the server compiler but preserved verbatim by the
 * client one. The two renders then disagree on the attribute value and React
 * aborts hydration for the whole tree — which, when an entrance animation is
 * what reveals your content, blanks the page below the fold.
 *
 * Keep every string on one line. Do not reformat this file with a printer that
 * wraps long lines.
 */

/* prettier-ignore */
export const ENSO = {
  main: 'M 100 18 A 82 82 0 1 1 44 42',
  weight: 'M 128 24 A 82 82 0 0 1 178 88',
  tail: 'M 60 168 A 82 82 0 0 0 150 152',
} as const

/* prettier-ignore */
export const SAKURA = {
  branch: 'M 4 126 C 40 118 62 104 84 86 C 104 70 128 58 158 50 C 182 44 206 42 232 44 L 232 52 C 208 50 184 52 162 58 C 132 66 110 78 92 94 C 70 112 44 126 8 134 Z',
  twig1: 'M 86 88 C 92 74 96 62 94 48 L 99 47 C 102 62 98 76 91 90 Z',
  twig2: 'M 138 62 C 142 78 138 90 126 100 L 122 96 C 133 87 137 77 133 63 Z',
  twig3: 'M 176 48 C 182 40 188 36 198 34 L 199 39 C 190 41 184 45 180 51 Z',
} as const

/* prettier-ignore */
export const BAMBOO = {
  leaf1: 'M 47 66 C 70 52 92 48 116 52 C 96 68 72 76 48 74 Z',
  leaf2: 'M 26 122 C 8 112 2 96 2 78 C 16 92 24 106 30 124 Z',
  leaf3: 'M 87 168 C 106 158 116 144 119 126 C 104 142 94 154 86 170 Z',
  leaf4: 'M 47 196 C 68 188 86 190 104 198 C 84 204 64 204 46 200 Z',
} as const

/* prettier-ignore */
export const TORII = {
  kasagi: 'M 8 34 C 62 20 138 20 192 34 L 192 46 C 138 33 62 33 8 46 Z',
  postL: 'M 46 30 L 62 30 L 68 168 L 40 168 Z',
  postR: 'M 138 30 L 154 30 L 160 168 L 132 168 Z',
} as const

/* prettier-ignore */
export const FUJI = {
  mountain: 'M 14 140 C 48 116 72 92 96 68 C 100 64 106 62 110 62 C 116 62 120 65 124 70 C 148 96 172 118 206 140 C 168 132 130 128 110 128 C 90 128 52 132 14 140 Z',
  snow: 'M 96 74 C 102 80 108 82 112 80 C 116 78 120 74 124 76 L 118 68 C 114 63 106 63 102 68 Z',
} as const

/* prettier-ignore */
export const CRANE = {
  body: 'M 64 104 C 78 86 108 80 132 88 C 152 95 166 106 182 116 C 164 116 152 120 142 128 C 120 140 88 138 72 126 C 63 119 60 111 64 104 Z',
  tail: 'M 158 112 C 172 108 184 104 196 96 C 190 110 178 120 164 124 Z',
  wing: 'M 86 102 C 106 92 128 94 148 106 C 128 105 106 108 90 114 Z',
  neck: 'M 68 104 C 58 86 55 64 62 48 C 65 41 71 38 76 42 C 68 56 64 78 74 100 Z',
  head: 'M 62 50 C 56 43 57 34 64 31 C 71 29 77 34 77 41 C 77 48 69 52 63 50 Z',
  beak: 'M 60 37 L 36 32 L 60 44 Z',
  legL: 'M 104 136 L 108 180 L 102 180 L 96 136 Z',
  legR: 'M 126 134 L 138 176 L 132 178 L 118 136 Z',
  foot: 'M 108 180 L 128 186 L 106 186 Z',
} as const

/*
  Samurai silhouette. The three cues that actually make a figure read as a
  samurai rather than a generic robed man are the sharply winged kataginu
  shoulders, the wide flared hakama with a centre split, and the daishō worn
  edge-up at the left hip. An earlier pass had rounded shoulders, straight
  trousers and a stub of a sword, and read as a robot.
*/
/* prettier-ignore */
export const SAMURAI = {
  topknot: 'M 150 32 C 163 21 178 19 186 25 C 173 29 162 38 156 49 Z',
  head: 'M 124 60 C 122 44 130 33 142 33 C 155 33 164 45 160 60 C 156 75 130 76 124 60 Z',
  neck: 'M 132 72 L 154 72 L 156 92 L 130 92 Z',
  shoulders: 'M 68 120 L 112 82 L 172 82 L 214 120 L 200 138 L 166 108 L 118 108 L 82 138 Z',
  torso: 'M 116 104 L 168 104 L 172 178 L 112 178 Z',
  sash: 'M 106 172 L 176 172 L 178 192 L 104 192 Z',
  hakamaL: 'M 104 190 L 138 190 L 133 276 L 72 286 Z',
  hakamaR: 'M 144 190 L 178 190 L 210 286 L 148 276 Z',
  footL: 'M 72 278 L 136 271 L 138 291 L 68 295 Z',
  footR: 'M 146 271 L 210 278 L 214 295 L 144 291 Z',
  armL: 'M 88 128 C 76 150 71 176 74 200 L 94 197 C 91 175 96 152 106 134 Z',
  armR: 'M 196 128 C 208 150 213 174 210 198 L 190 195 C 193 175 188 152 178 134 Z',
  bladeSheath: 'M 34 236 C 68 214 104 198 142 190 L 145 200 C 108 209 74 225 42 248 Z',
  hilt: 'M 18 250 C 24 243 29 238 36 233 L 46 244 C 39 249 33 254 28 261 Z',
  bladeShort: 'M 44 258 C 72 240 100 228 130 221 L 132 229 C 103 237 77 248 51 266 Z',
} as const
