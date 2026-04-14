"use client"

import { useState } from "react"
import { QuizAnswerCard } from "@/components/ui/QuizAnswerCard"

const ANSWERS = [
  {
    id: "a",
    headline: "Oily / Combination",
    description:
      "Your skin tends to look shiny by midday, especially around the T-zone. You may experience enlarged pores.",
  },
  {
    id: "b",
    headline: "Dry / Sensitive",
    description:
      "Your skin often feels tight, rough, or flaky. It may react easily to new products, weather, or stress.",
  },
  {
    id: "c",
    headline: "Normal / Balanced",
    description:
      "Your skin is neither too oily nor too dry. You rarely experience breakouts or sensitivity.",
  },
  {
    id: "d",
    headline: "Acne-prone",
    description:
      "You experience regular breakouts, clogged pores, or blemishes regardless of your current skincare routine.",
  },
]

export function QuizAnswerCardShowcase() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="bg-background-subtle py-16 px-10 border-t border-border-subtle">
      <div className="max-w-[900px] mx-auto flex flex-col gap-16">

        <div className="flex flex-col gap-2">
          <p className="text-label-m font-sans font-medium text-text-muted leading-label uppercase tracking-widest">
            Component
          </p>
          <h1 className="text-h1 font-sans font-medium text-text-primary leading-headline">
            QuizAnswerCard
          </h1>
          <p className="text-paragraph-m font-sans text-text-secondary leading-paragraph mt-1">
            Default · Hover (mouse over) · Selected — 2×2 grid layout
          </p>
        </div>

        {/* 2×2 grid — mirrors Figma Quiz page layout */}
        <section className="flex flex-col gap-6">
          <h2 className="text-h4 font-sans font-medium text-text-primary border-b border-border-subtle pb-3">
            Interactive — click to select
          </h2>
          <p className="text-paragraph-s font-sans text-text-muted leading-paragraph -mt-2">
            Currently selected: {selected ? `"${ANSWERS.find((a) => a.id === selected)?.headline}"` : "none"}
          </p>
          <div className="grid grid-cols-2 gap-5">
            {ANSWERS.map((a) => (
              <QuizAnswerCard
                key={a.id}
                headline={a.headline}
                description={a.description}
                selected={selected === a.id}
                onClick={() => setSelected(selected === a.id ? null : a.id)}
              />
            ))}
          </div>
        </section>

        {/* Static states side-by-side */}
        <section className="flex flex-col gap-6">
          <h2 className="text-h4 font-sans font-medium text-text-primary border-b border-border-subtle pb-3">
            States — static
          </h2>
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <span className="text-label-s font-sans text-text-muted leading-label">Default</span>
              <QuizAnswerCard
                headline="Normal / Balanced"
                description="Your skin is neither too oily nor too dry. You rarely experience breakouts or sensitivity."
                selected={false}
                onClick={() => {}}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-label-s font-sans text-text-muted leading-label">Selected</span>
              <QuizAnswerCard
                headline="Dry / Sensitive"
                description="Your skin often feels tight, rough, or flaky. It may react easily to new products or weather."
                selected={true}
                onClick={() => {}}
              />
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
