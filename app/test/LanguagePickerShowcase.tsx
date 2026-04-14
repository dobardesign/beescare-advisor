"use client"

import { useState } from "react"
import { LanguagePicker, type Lang } from "@/components/ui/LanguagePicker"

export function LanguagePickerShowcase() {
  const [lang, setLang] = useState<Lang>("sr")

  return (
    <div className="bg-background-subtle py-16 px-10 border-t border-border-subtle">
      <div className="max-w-[900px] mx-auto flex flex-col gap-16">

        <div className="flex flex-col gap-2">
          <p className="text-label-m font-sans font-medium text-text-muted leading-label uppercase tracking-widest">
            Component
          </p>
          <h1 className="text-h1 font-sans font-medium text-text-primary leading-headline">
            LanguagePicker
          </h1>
          <p className="text-paragraph-m font-sans text-text-secondary leading-paragraph mt-1">
            Pill trigger · dropdown · SR / EN · outside-click to close
          </p>
        </div>

        <section className="flex flex-col gap-6">
          <h2 className="text-h4 font-sans font-medium text-text-primary border-b border-border-subtle pb-3">
            Interactive
          </h2>
          <p className="text-paragraph-s font-sans text-text-muted leading-paragraph -mt-2">
            Current: <strong>{lang === "sr" ? "Srpski" : "English"}</strong> — click to open dropdown
          </p>
          <div className="flex items-start gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-label-s font-sans text-text-muted leading-label">Standalone</span>
              <LanguagePicker value={lang} onChange={setLang} />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-label-s font-sans text-text-muted leading-label">In nav context</span>
              {/* Simulates the nav bar context from Figma */}
              <div className="flex items-center justify-between bg-background-default border border-border-subtle rounded-card px-10 py-4 w-[600px]">
                <span className="text-label-xl font-sans font-medium text-text-primary leading-label">
                  bee&apos;s care
                </span>
                <LanguagePicker value={lang} onChange={setLang} />
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-h4 font-sans font-medium text-text-primary border-b border-border-subtle pb-3">
            Both states — static
          </h2>
          <div className="flex items-start gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-label-s font-sans text-text-muted leading-label">SR selected</span>
              <LanguagePicker value="sr" onChange={() => {}} />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-label-s font-sans text-text-muted leading-label">EN selected</span>
              <LanguagePicker value="en" onChange={() => {}} />
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
