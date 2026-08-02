import type { Config } from 'tailwindcss'

/**
 * Samurai theme — washi paper ground, sumi ink text, vermillion accents.
 *
 * Every colour resolves through a CSS custom property defined in
 * app/globals.css rather than a literal, so the red intensity can be flipped at
 * runtime via the `data-ink` attribute on <html> without rebuilding. A
 * hard-coded hex here breaks that switch.
 *
 * The pre-existing token names (primary, background, foreground, card, muted,
 * accent) are preserved so component markup did not have to change when the
 * palette inverted from dark to light.
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
        background: 'rgb(var(--paper) / <alpha-value>)',
        foreground: 'rgb(var(--sumi) / <alpha-value>)',
        card: 'rgb(var(--paper-raised) / <alpha-value>)',
        muted: {
          DEFAULT: 'rgb(var(--sumi-soft) / <alpha-value>)',
          foreground: 'rgb(var(--sumi-soft) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--mist) / <alpha-value>)',
          light: 'rgb(var(--mist) / <alpha-value>)',
          dark: 'rgb(var(--sumi-soft) / <alpha-value>)',
        },

        // --- samurai palette ---
        paper: {
          DEFAULT: 'rgb(var(--paper) / <alpha-value>)',
          raised: 'rgb(var(--paper-raised) / <alpha-value>)',
          sunk: 'rgb(var(--paper-sunk) / <alpha-value>)',
        },
        sumi: {
          DEFAULT: 'rgb(var(--sumi) / <alpha-value>)',
          soft: 'rgb(var(--sumi-soft) / <alpha-value>)',
        },
        /** Kept as `crimson` so existing usages keep working; it is vermillion (朱). */
        crimson: 'rgb(var(--vermillion) / <alpha-value>)',
        vermillion: 'rgb(var(--vermillion) / <alpha-value>)',
        gold: 'rgb(var(--gold) / <alpha-value>)',
        sakura: 'rgb(var(--sakura) / <alpha-value>)',
        /** The light-on-dark colour, i.e. paper. Used for text on vermillion fills. */
        moonlight: 'rgb(var(--paper) / <alpha-value>)',
        /** Genuinely dark surfaces — tooltips, code blocks — on a light ground. */
        ink: {
          DEFAULT: 'rgb(var(--sumi) / <alpha-value>)',
          900: 'rgb(var(--sumi) / <alpha-value>)',
          800: 'rgb(var(--sumi-raised) / <alpha-value>)',
          700: 'rgb(var(--sumi-soft) / <alpha-value>)',
        },
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
        'ink-reveal': 'inkReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'brush-in': 'brushIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        slash: 'slash 0.6s cubic-bezier(0.65, 0, 0.35, 1) forwards',
        'sumi-bleed': 'sumiBleed 1.4s ease-out forwards',
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
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgb(var(--vermillion) / calc(var(--glow) * 0.5))' },
          '50%': {
            boxShadow:
              '0 0 34px rgb(var(--vermillion) / var(--glow)), 0 0 60px rgb(var(--gold) / calc(var(--glow) * 0.4))',
          },
        },
        inkReveal: {
          from: { opacity: '0', clipPath: 'inset(0 0 100% 0)' },
          to: { opacity: '1', clipPath: 'inset(0 0 0% 0)' },
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
        // Ink soaking outward into paper.
        sumiBleed: {
          from: { opacity: '0', transform: 'scale(0.94)', filter: 'blur(10px)' },
          to: { opacity: '1', transform: 'scale(1)', filter: 'blur(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
