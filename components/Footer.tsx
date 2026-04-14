import { ExternalLink } from "lucide-react"

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Figma: Footer — bg-background-inverse (#110f10), px-10 py-[52px].
 *
 * Left:  "Powered by" + DOBAR logotype (Sora ExtraBold, orange + white)
 *        + external link icon
 * Right: © copyright line
 *
 * Font-dobar uses the Sora variable injected by Next.js font loader
 * in layout.tsx (--font-sora → font-dobar Tailwind utility).
 */
export function Footer() {
  return (
    <footer className="bg-background-inverse px-5 md:px-10 py-8 md:py-[52px] w-full shrink-0">
      {/* Mobile: stacked + centered. Desktop: side-by-side, 748px, justify-between */}
      <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left w-full max-w-[748px] mx-auto">

        {/* ── DOBAR branding ─────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5">
          <span className="text-label-s font-sans text-text-muted leading-none tracking-[-0.12px] whitespace-nowrap">
            Powered by
          </span>

          {/* DOBAR wordmark — Figma: Sora ExtraBold, "do" in orange, "bar" in white */}
          <a
            href="https://dobar.rs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus rounded-sm"
          >
            <span className="font-dobar text-[16px] font-extrabold uppercase tracking-[-0.16px] leading-none whitespace-nowrap">
              <span className="text-dobar-orange">DO</span>
              <span className="text-white">BAR</span>
            </span>
            <ExternalLink
              size={11}
              className="text-text-muted group-hover:text-white transition-colors duration-150 ml-0.5"
              aria-hidden="true"
            />
          </a>
        </div>

        {/* ── Copyright ──────────────────────────────────────────────── */}
        <p className="text-paragraph-s font-sans text-text-muted leading-paragraph">
          © 2026 bee&apos;s care | All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
