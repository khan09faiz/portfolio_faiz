import type { Config } from 'tailwindcss'

/**
 * Samurai theme (see docs/UI_DESIGN.md).
 *
 * Every colour resolves through a CSS custom property defined in app/globals.css
 * rather than a literal, so the crimson intensity can be flipped at runtime via
 * the `data-ink` attribute on <html> without rebuilding. Keep it that way — a
 * hard-coded hex here breaks the restrained/bold switch.
 *
 * The pre-existing token names (primary, background, foreground, card, muted,
 * accent) are preserved so no existing component markup had to change.
 */
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // --- existing names, now token-driven ---
        primary: 'rgb(var(--primary) / <alpha-value>)',
        background: 'rgb(var(--ink-900) / <alpha-value>)',
        foreground: 'rgb(var(--moonlight) / <alpha-value>)',
        card: 'rgb(var(--ink-800) / <alpha-value>)',
        muted: {
          DEFAULT: 'rgb(var(--mist) / <alpha-value>)',
          foreground: 'rgb(var(--mist-light) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--mist) / <alpha-value>)',
          light: 'rgb(var(--mist-light) / <alpha-value>)',
          dark: 'rgb(var(--mist-dark) / <alpha-value>)',
        },

        // --- samurai additions ---
        ink: {
          DEFAULT: 'rgb(var(--ink-900) / <alpha-value>)',
          900: 'rgb(var(--ink-900) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
        },
        crimson: 'rgb(var(--crimson) / <alpha-value>)',
        gold: 'rgb(var(--gold) / <alpha-value>)',
        moonlight: 'rgb(var(--moonlight) / <alpha-value>)',
        sakura: 'rgb(var(--sakura) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        glow: 'glow 2s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        // samurai
        'ink-reveal': 'inkReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'brush-in': 'brushIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slash': 'slash 0.6s cubic-bezier(0.65, 0, 0.35, 1) forwards',
        'ember': 'ember 7s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgb(var(--crimson) / calc(var(--glow) * 0.6))' },
          '50%': {
            boxShadow:
              '0 0 40px rgb(var(--crimson) / var(--glow)), 0 0 60px rgb(var(--gold) / calc(var(--glow) * 0.5))',
          },
        },
        // Ink spreading into washi paper: mask wipes upward as opacity lifts.
        inkReveal: {
          from: {
            opacity: '0',
            clipPath: 'inset(0 0 100% 0)',
            filter: 'blur(6px)',
          },
          to: {
            opacity: '1',
            clipPath: 'inset(0 0 0% 0)',
            filter: 'blur(0)',
          },
        },
        brushIn: {
          from: { opacity: '0', transform: 'translateX(-14px) skewX(-6deg)' },
          to: { opacity: '1', transform: 'translateX(0) skewX(0)' },
        },
        slash: {
          from: { transform: 'scaleX(0) rotate(-18deg)', opacity: '0' },
          '40%': { opacity: '1' },
          to: { transform: 'scaleX(1) rotate(-18deg)', opacity: '0' },
        },
        ember: {
          '0%, 100%': { opacity: '0.25', transform: 'translateY(0)' },
          '50%': { opacity: '0.6', transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
