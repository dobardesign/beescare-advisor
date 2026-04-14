"use client"

import Image from "next/image"
import { LanguagePicker, type Lang } from "@/components/ui/LanguagePicker"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavbarProps {
  lang: Lang
  onLangChange: (lang: Lang) => void
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <a
      href="/"
      className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded-sm"
      aria-label="bee's care — home"
    >
      <Image
        src="/images/logo.svg"
        alt="bee's care"
        width={195}
        height={49}
        priority
        className="!w-[120px] !h-auto md:!w-[195px]"
      />
    </a>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Figma: top nav bar — white bg, px-10 py-4, sticky.
 * Left: bee's care logo. Right: LanguagePicker.
 */
export function Navbar({ lang, onLangChange }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-background-default border-b border-border-subtle">
      <div className="flex items-center justify-between px-4 md:px-10 py-3 md:py-4 w-full">
        <Logo />
        <LanguagePicker value={lang} onChange={onLangChange} />
      </div>
    </header>
  )
}
