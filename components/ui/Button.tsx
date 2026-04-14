"use client"

import { type ButtonHTMLAttributes, type ReactNode } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "outlined"
export type ButtonSize = "default" | "sm"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * "primary"  — filled, gold background (#c2986b)
   * "outlined" — transparent background, bordered
   */
  variant?: ButtonVariant

  /**
   * "default" — h-11 (44px), px-5 (20px), py-3 (12px) — matches Figma Button height
   * "sm"      — h-9  (36px), px-4 (16px), py-2 (8px)  — compact chip variant
   */
  size?: ButtonSize

  /** Icon rendered before the label. Accepts any ReactNode (SVG, img, etc.). */
  iconLeft?: ReactNode

  /** Icon rendered after the label. Accepts any ReactNode. */
  iconRight?: ReactNode
}

// ─── Class maps ───────────────────────────────────────────────────────────────

/**
 * Classes shared by both variants.
 * tracking-normal = letter-spacing: 0 (Figma: typography/letter-spacing/regular)
 */
const BASE =
  "inline-flex items-center justify-center gap-2 " +
  "rounded-pill " +
  "font-sans font-medium text-label-xl leading-label tracking-normal " +
  "select-none whitespace-nowrap cursor-pointer " +
  "transition-colors duration-150 " +
  "focus-visible:outline-none " +
  "disabled:cursor-not-allowed"

const SIZE: Record<ButtonSize, string> = {
  /** Figma: spacing/20 px · spacing/12 py · height 44px */
  default: "h-11 px-5 py-3",
  /** Compact chip — not in Figma spec, kept proportional */
  sm: "h-9 px-4 py-2 text-label-m",
}

/**
 * Hover / pressed overlay technique mirrors Figma exactly:
 *   Hover:   linear-gradient(rgba(0,0,0,0.05), …) on top of bg-color
 *   Pressed: linear-gradient(rgba(0,0,0,0.20), …) on top of bg-color
 *
 * CSS background-image stacks above background-color, so the semi-transparent
 * gradient darkens the underlying token colour without changing it.
 *
 * `enabled:` prevents hover/active effects firing on a disabled button.
 */
const VARIANT: Record<ButtonVariant, string> = {
  primary: [
    // Default state
    "bg-button-primary-bg text-button-primary-text",
    // Hover — Figma: color/interaction/hover overlay (rgba 0,0,0,0.05)
    "hover:enabled:[background-image:linear-gradient(rgba(0,0,0,0.05),rgba(0,0,0,0.05))]",
    // Pressed — Figma: color/interaction/pressed overlay (rgba 0,0,0,0.20)
    "active:enabled:[background-image:linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.2))]",
    // Focused — Figma: border color/border/focus (#b0865e)
    "focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-0",
    // Disabled — Figma: bg color/alpha/black/10, text color/button/primary/text-disabled
    "disabled:bg-interaction-disabled disabled:text-button-primary-text-disabled",
  ].join(" "),

  outlined: [
    // Default state
    "bg-transparent border border-button-outline-border text-button-outline-text",
    // Hover — Figma: color/interaction/hover bg (rgba 0,0,0,0.05)
    "hover:enabled:bg-interaction-hover",
    // Pressed — Figma: color/interaction/pressed bg (rgba 0,0,0,0.20)
    "active:enabled:bg-interaction-pressed",
    // Focused — Figma: border color/interaction/focus-ring (#c9a274)
    "focus-visible:border-interaction-focus-ring",
    // Disabled — Figma: border color/button/outline/border-disabled, text-disabled
    "disabled:border-button-outline-border-disabled disabled:text-button-outline-text-disabled",
  ].join(" "),
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Button({
  variant = "primary",
  size = "default",
  iconLeft,
  iconRight,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[BASE, SIZE[size], VARIANT[variant], className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {iconLeft && (
        <span
          aria-hidden="true"
          className="shrink-0 size-5 flex items-center justify-center"
        >
          {iconLeft}
        </span>
      )}

      <span>{children}</span>

      {iconRight && (
        <span
          aria-hidden="true"
          className="shrink-0 size-5 flex items-center justify-center"
        >
          {iconRight}
        </span>
      )}
    </button>
  )
}
