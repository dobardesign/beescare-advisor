"use client"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuestionCardProps {
  question: string
  lang?: "sr" | "en"
  /** Kept for API compatibility but no longer renders an edit button. */
  onEdit?: () => void
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Figma: "Question" — node 2040:4413
 *
 * Exact measurements:
 *   width    487px  (max-w-[487px])
 *   padding  24px   (p-6)
 *   gap      10px   between header / divider / body
 *   border   1px border-subtle (#EFEDEC)
 *   radius   24px   (rounded-card)
 *   bg       white
 *
 * Typography:
 *   "Your question"  label-s / medium / text-secondary
 *   body             paragraph-m / regular / text-secondary / leading 1.5
 */
export function QuestionCard({ question, lang = "sr", className }: QuestionCardProps) {
  return (
    <div
      className={[
        "bg-background-default border border-border-subtle rounded-card",
        "flex flex-col gap-[10px] p-6",
        "w-full max-w-[487px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ── Label ─────────────────────────────────────────────────────── */}
      <span className="text-label-s font-sans font-medium leading-label text-text-secondary whitespace-nowrap">
        {lang === "sr" ? "Tvoje pitanje" : "Your question"}
      </span>

      {/* ── Divider ───────────────────────────────────────────────────── */}
      <div className="w-full border-t border-border-subtle" />

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <p className="text-paragraph-m font-sans leading-paragraph text-text-secondary w-full">
        {question}
      </p>
    </div>
  )
}
