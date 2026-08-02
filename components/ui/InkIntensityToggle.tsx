/**
 * InkIntensityToggle
 *
 * ⚠ PREVIEW-ONLY. Remove this component (and its mount in app/layout.tsx)
 * before merging the samurai theme to main. It exists so the restrained and
 * bold crimson treatments can be compared on a deployed preview without two
 * separate branches.
 *
 * Writes `data-ink` on <html>; every colour token in globals.css keys off it,
 * so the whole site — including the canvas atmosphere and the ink cursor,
 * which observe the attribute — switches instantly.
 *
 * Also honours `?ink=bold` / `?ink=restrained` in the URL, applied before first
 * paint by the inline script in app/layout.tsx.
 */

'use client'

import { useSyncExternalStore } from 'react'

type Intensity = 'restrained' | 'bold'

const STORAGE_KEY = 'ink-intensity'

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-ink'],
  })
  return () => observer.disconnect()
}

function getSnapshot(): Intensity {
  return document.documentElement.getAttribute('data-ink') === 'bold' ? 'bold' : 'restrained'
}

function getServerSnapshot(): Intensity {
  return 'restrained'
}

export function InkIntensityToggle() {
  const intensity = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const set = (next: Intensity) => {
    const root = document.documentElement

    // See .ink-switching in globals.css: without this, anything with
    // `transition-all` latches its pre-switch colour and never updates.
    root.classList.add('ink-switching')

    if (next === 'bold') {
      root.setAttribute('data-ink', 'bold')
    } else {
      root.removeAttribute('data-ink')
    }

    // Two frames: one for the attribute change to be styled, one to be painted.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.remove('ink-switching'))
    })
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Private browsing / storage disabled — the toggle still works for this
      // page view, it just will not persist.
    }
  }

  return (
    <div
      className="fixed bottom-4 left-4 z-[70] flex items-center gap-1 rounded-full border border-crimson/30 bg-ink-800/80 p-1 backdrop-blur-md"
      role="group"
      aria-label="Preview: crimson intensity"
    >
      <span className="px-2 font-mono text-[10px] uppercase tracking-wider text-muted">ink</span>
      {(['restrained', 'bold'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => set(option)}
          aria-pressed={intensity === option}
          className={`rounded-full px-3 py-1 text-xs transition-colors ${
            intensity === option
              ? 'bg-crimson text-moonlight'
              : 'text-muted hover:text-moonlight'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
