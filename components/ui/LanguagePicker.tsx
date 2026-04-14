"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type Lang = "sr" | "en"

export interface LanguagePickerProps {
  value: Lang
  onChange: (value: Lang) => void
  className?: string
}

// ─── Options ──────────────────────────────────────────────────────────────────

const OPTIONS: { value: Lang; label: string; flag: string }[] = [
  { value: "sr", label: "Srpski", flag: "🇷🇸" },
  { value: "en", label: "English", flag: "🇬🇧" },
]

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Figma: "Language-picker" — pill-shaped nav language switcher.
 *
 * Exact measurements from Figma:
 *   width          131px (trigger)
 *   height         36px  (h-9 = py-[8px] + label-xl line-height ≈ 36px)
 *   padding        px-3 py-2  (12px / 8px)
 *   border         border-button-outline-border (#a8a29e) — same as outlined button
 *   radius         rounded-pill (9999px)
 *
 * Layout:
 *   [flag emoji  label-xl medium]   [ChevronDown]
 *   justify-between, items-center
 *
 * Dropdown:
 *   Opens below trigger, same width (min), border-subtle, rounded-card
 *   Closes on outside click (useEffect + ref)
 *   ChevronDown rotates 180° when open
 */
export function LanguagePicker({ value, onChange, className }: LanguagePickerProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const current = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0]

  // Close on click outside
  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open])

  function handleSelect(lang: Lang) {
    onChange(lang)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className={["relative inline-block", className].filter(Boolean).join(" ")}>

      {/* ── Trigger ──────────────────────────────────────────────────── */}
      {/*
        Figma: border-button-outline-border, rounded-pill, px-3 py-2, w-[131px]
        Left:  flag + label (gap-2)
        Right: chevron (rotates on open)
      */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          // Shape — Figma: rounded-pill, border, px-[12px] py-[8px]
          "flex items-center justify-between gap-2 w-[131px] h-9",
          "px-3 py-2 rounded-pill border border-button-outline-border",
          // Background — white, hover: subtle tint
          "bg-background-default",
          "hover:bg-interaction-hover",
          // Typography
          "text-label-xl font-sans font-medium leading-label text-button-outline-text",
          // Transitions
          "transition-colors duration-150",
          // Focus
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          "cursor-pointer",
        ].join(" ")}
      >
        {/* Flag + label */}
        <span className="flex items-center gap-2 min-w-0">
          <span className="text-base leading-none" aria-hidden="true">
            {current.flag}
          </span>
          <span className="truncate">{current.label}</span>
        </span>

        {/* Chevron — Figma: weui:arrow-filled rotated 90° = chevron down */}
        <ChevronDown
          size={16}
          className={[
            "shrink-0 transition-transform duration-150",
            open ? "rotate-180" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden="true"
        />
      </button>

      {/* ── Dropdown ─────────────────────────────────────────────────── */}
      {open && (
        <ul
          role="listbox"
          aria-label="Select language"
          className={[
            // Position — flush below trigger, same width
            "absolute top-full left-0 mt-1 min-w-full z-50",
            // Appearance
            "bg-background-default border border-border-subtle rounded-card",
            "shadow-input-active",
            // Layout
            "flex flex-col overflow-hidden py-1",
          ].join(" ")}
        >
          {OPTIONS.map((opt) => {
            const isSelected = opt.value === value
            return (
              <li key={opt.value} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  className={[
                    "w-full flex items-center gap-2 px-3 py-2",
                    "text-label-xl font-sans font-medium leading-label",
                    "text-left cursor-pointer transition-colors duration-100",
                    "focus-visible:outline-none focus-visible:bg-interaction-hover",
                    isSelected
                      ? "text-button-outline-text bg-interaction-hover"
                      : "text-button-outline-text hover:bg-interaction-hover",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="text-base leading-none" aria-hidden="true">
                    {opt.flag}
                  </span>
                  <span>{opt.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
