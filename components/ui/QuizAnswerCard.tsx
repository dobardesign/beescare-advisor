"use client"

import { Check } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuizAnswerCardProps {
  /** Short answer label — label-s / font-medium */
  headline: string
  /** Supporting body copy — paragraph-m / font-regular */
  description: string
  /** Controlled selection state from parent */
  selected: boolean
  onClick: () => void
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Figma: "Quizz" component — answer option card in the 2×2 quiz grid.
 *
 * Exact measurements from Figma:
 *   width      364px per card (2 per row, gap 20px, in 748px column)
 *   padding    24px   (p-6)
 *   gap        10px   (gap-[10px]) between header / divider / body
 *   radius     24px   (rounded-card)
 *
 * States (Figma variants):
 *   Default   — border-border-subtle (#efedec),  white bg, no checkmark
 *   Hover     — border-border-strong (#c9c5c2),  interaction-hover bg overlay
 *   Selected  — border-border-brand  (#c2986b),  white bg, gold checkmark
 *
 * The state border colour and the checkmark visibility are the only
 * visual differences between the three states in Figma.
 */
export function QuizAnswerCard({
  headline,
  description,
  selected,
  onClick,
  className,
}: QuizAnswerCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        // Layout — tighter on mobile for touch-friendly compact feel
        "flex flex-col gap-2 md:gap-[10px] p-4 md:p-6 w-full text-left min-h-[80px]",
        // Shape
        "rounded-card border bg-background-default",
        // States — border colour + hover bg
        selected
          ? // Figma: Selected — border-brand, gold checkmark visible
            "border-border-brand"
          : // Figma: Default + Hover
            [
              "border-border-subtle",
              "hover:border-border-strong",
              "hover:bg-interaction-hover",
            ].join(" "),
        // Smooth state transitions
        "transition-colors duration-150",
        // Pointer
        "cursor-pointer",
        // Focus ring
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ── Header: headline + optional checkmark ─────────────────────── */}
      {/*
        Figma default:   flex items-center h-[20px]         → headline fills full width
        Figma selected:  flex items-center justify-between  → headline + check icon
      */}
      <div
        className={[
          "flex items-center w-full min-h-5",
          selected ? "justify-between" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="text-label-s font-sans font-medium leading-label text-text-secondary whitespace-nowrap">
          {headline}
        </span>

        {/* Figma: mingcute:check-fill — 20×20, gold, only in selected state */}
        {selected && (
          <Check
            size={20}
            color="#c2986b"
            strokeWidth={2.5}
            className="shrink-0"
            aria-hidden="true"
          />
        )}
      </div>

      {/* ── Divider ───────────────────────────────────────────────────── */}
      <div className="w-full border-t border-border-subtle" />

      {/* ── Description ───────────────────────────────────────────────── */}
      {/* Figma: paragraph-m / regular / text-secondary / leading 1.5 */}
      <p className="text-paragraph-s md:text-paragraph-m font-sans leading-paragraph text-text-secondary w-full text-left">
        {description}
      </p>
    </button>
  )
}
