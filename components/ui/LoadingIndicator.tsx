"use client"

import { useState, useEffect } from "react"
import { type Lang } from "@/components/ui/LanguagePicker"

// ─── Copy ─────────────────────────────────────────────────────────────────────

const PHASES: Record<Lang, string[]> = {
  sr: [
    "Analiziramo tvoj problem...",
    "Istražujemo prirodne sastojke...",
    "Pronalazimo prave proizvode...",
    "Pripremamo preporuku...",
  ],
  en: [
    "Analyzing your concern...",
    "Researching natural ingredients...",
    "Finding the right products...",
    "Preparing your recommendation...",
  ],
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoadingIndicatorProps {
  lang?: Lang
  /** Override all phase text with a single static string. */
  text?: string
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Figma: "Loading/Research" — spinning arc + cycling phase text.
 *
 * Phases cycle every 2 s: fade-out 300 ms → swap text → fade-in 300 ms.
 * The arc spins continuously throughout. Phase 4 holds until unmounted.
 */
export function LoadingIndicator({
  lang = "sr",
  text,
  className,
}: LoadingIndicatorProps) {
  const phases = PHASES[lang]

  const [phaseIndex, setPhaseIndex] = useState(0)
  const [visible, setVisible]       = useState(true)

  useEffect(() => {
    // If a static text override is provided, skip cycling
    if (text) return

    const interval = setInterval(() => {
      setPhaseIndex((prev) => {
        if (prev >= phases.length - 1) {
          clearInterval(interval)
          return prev
        }

        // Fade out, swap, fade in
        setVisible(false)
        setTimeout(() => {
          setPhaseIndex(prev + 1)
          setVisible(true)
        }, 300)

        return prev
      })
    }, 2000)

    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, text])

  const label = text ?? phases[phaseIndex]

  return (
    <>
      <style>{`
        @keyframes bc-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes bc-breathe {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
      `}</style>

      <div
        className={[
          "inline-flex items-center gap-3",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ animation: "bc-breathe 2s ease-in-out infinite" }}
        aria-live="polite"
        aria-label={label}
        role="status"
      >
        {/* ── Spinner ──────────────────────────────────────────────── */}
        <div className="relative size-11 shrink-0">
          {/* Static track */}
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: "2px solid #EFEDEC" }}
            aria-hidden="true"
          />
          {/* Spinning gold arc */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "2px solid transparent",
              borderTopColor: "#B5924A",
              animation: "bc-spin 1.2s linear infinite",
            }}
            aria-hidden="true"
          />
          {/* Static leaf icon — inline SVG so it never shifts */}
          <svg
            className="absolute inset-0 m-auto"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c2986b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
        </div>

        {/* ── Cycling phase text ────────────────────────────────────── */}
        <p
          className="text-paragraph-s font-sans leading-paragraph text-text-secondary"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 400ms ease-in-out",
          }}
          aria-hidden="true"
        >
          {label}
        </p>
      </div>
    </>
  )
}
