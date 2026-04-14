"use client"

import { useState } from "react"
import Image from "next/image"
import { CheckCircle2, Star, Sparkles, ExternalLink } from "lucide-react"
import { Button } from "./Button"

// ─── Badge types ──────────────────────────────────────────────────────────────

export type BadgeType = "best-match" | "good-pair" | "nice-addon"

const BADGE_CONFIG: Record<
  BadgeType,
  { label: string; icon: React.ReactElement; classes: string }
> = {
  "best-match": {
    label: "Best match",
    icon: <CheckCircle2 size={14} color="#c2986b" aria-hidden="true" />,
    classes: "bg-background-brand border-border-brand text-text-primary",
  },
  "good-pair": {
    label: "Good pair",
    icon: <Star size={14} color="#8c8885" aria-hidden="true" />,
    classes: "bg-background-subtle border-border-subtle text-text-muted",
  },
  "nice-addon": {
    label: "Nice addon",
    icon: <Sparkles size={14} color="#8c8885" aria-hidden="true" />,
    classes: "bg-transparent border-border-subtle text-text-muted",
  },
}

function Badge({ type }: { type: BadgeType }) {
  const { label, icon, classes } = BADGE_CONFIG[type]
  return (
    <div
      className={[
        "inline-flex items-center gap-1.5 px-2 py-1.5 rounded-pill border",
        classes,
      ].join(" ")}
    >
      {icon}
      <span className="text-label-s font-sans leading-label whitespace-nowrap">
        {label}
      </span>
    </div>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductCardProps {
  badge: BadgeType
  image: string
  imageAlt?: string
  name: string
  description: string
  highlights?: string[]
  href?: string
  reverse?: boolean
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Figma: "Frame 39225 / 39226 / 39227" — product recommendation card.
 *
 * Exact measurements from Figma:
 *   outer card     white bg, p-8 (32px), rounded-card
 *   inner layout   flex gap-8 (32px), items-center
 *   image          207×279px, rounded-[20px], object-cover
 *   content        flex-1, flex-col, gap-5
 */
export function ProductCard({
  badge,
  image,
  imageAlt = "",
  name,
  description,
  highlights = [],
  href,
  reverse = false,
  className,
}: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(image)

  return (
    <div
      className={[
        "bg-background-default rounded-card p-5 md:p-8",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Mobile: always stacked (image top, content below).
          Desktop: side-by-side, respecting the reverse prop. */}
      <div
        className={[
          "flex flex-col gap-5 md:flex-row md:gap-8 md:items-center",
          reverse ? "md:flex-row-reverse" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* ── Product image ─────────────────────────────────────────── */}
        {/* Mobile: full-width, 220px tall. Desktop: Figma 207×279px */}
        <div className="relative w-full h-[220px] md:w-[207px] md:h-[279px] md:shrink-0 rounded-[20px] overflow-hidden bg-background-subtle">
          <Image
            src={imgSrc}
            alt={imageAlt || name}
            fill
            sizes="(max-width: 768px) 100vw, 207px"
            className="object-cover"
            onError={() => setImgSrc("/images/product-placeholder.svg")}
          />
        </div>

        {/* ── Content ───────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-5 items-start min-w-0">

          <div className="flex flex-col gap-4 items-start w-full">
            <Badge type={badge} />

            <div className="flex flex-col gap-3 w-full">
              {/* Figma: H4 / medium / text-primary / leading-headline */}
              <h3 className="text-h4 font-sans font-medium leading-headline text-text-primary">
                {name}
              </h3>

              {/* Figma: paragraph-s / regular / text-secondary / leading-paragraph */}
              <p className="text-paragraph-s font-sans leading-paragraph text-text-secondary">
                {description}
              </p>

              {highlights.length > 0 && (
                <ul className="list-disc list-inside flex flex-col gap-0.5">
                  {highlights.map((item, i) => (
                    <li
                      key={i}
                      className="text-h6 font-sans font-medium leading-headline text-text-primary"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ── Learn more button ─────────────────────────────────── */}
          <Button
            variant="primary"
            size="default"
            iconLeft={<ExternalLink size={16} aria-hidden="true" />}
            className="w-full md:w-auto"
            {...(href ? { onClick: () => window.open(href, "_blank") } : {})}
          >
            Learn more
          </Button>
        </div>
      </div>
    </div>
  )
}
