"use client"

import {
  useRef,
  useState,
  type KeyboardEvent,
  type TextareaHTMLAttributes,
} from "react"
import { Button } from "./Button"

// ─── Types ────────────────────────────────────────────────────────────────────

export type InputSize = "default" | "sm"

export interface InputProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  /**
   * "default" — 162px tall (homepage hero input)
   * "sm"      — 106px tall (compact contexts)
   */
  size?: InputSize

  /**
   * Hard character limit. Counter shown when user starts typing.
   * Browser maxLength prevents typing past this value.
   * @default 500
   */
  maxChars?: number

  /**
   * Called when the send button is clicked or Ctrl/Cmd+Enter is pressed.
   * Receives the current trimmed value and clears the textarea afterwards.
   */
  onSend?: (value: string) => void
}

// ─── Icons ────────────────────────────────────────────────────────────────────

/**
 * Up-right diagonal arrow — Figma "send" icon inside the InputBox.
 * Colour is inherited via `currentColor`; the parent button controls it.
 */
function IconSend() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="size-5"
      aria-hidden="true"
    >
      <path
        d="M5 15L15 5M15 5H8M15 5V12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

const HEIGHT: Record<InputSize, string> = {
  /** Mobile: 120px. Desktop: 162px (Figma spec). */
  default: "h-[120px] md:h-[162px]",
  /** Figma: InputBox / Small — height 106px */
  sm: "h-[106px]",
}

const DEFAULT_PLACEHOLDER = "Write about your skincare concern.."
const DEFAULT_MAX = 500

export function Input({
  size = "default",
  maxChars = DEFAULT_MAX,
  onSend,
  disabled = false,
  placeholder = DEFAULT_PLACEHOLDER,
  className,
  ...rest
}: InputProps) {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const hasText = value.trim().length > 0
  const count = value.length

  // ── Handlers ──

  function handleSend() {
    if (!hasText || disabled) return
    onSend?.(value.trim())
    setValue("")
    textareaRef.current?.focus()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      handleSend()
    }
  }

  // ── Render ──

  return (
    <div
      className={[
        // Layout
        "relative flex flex-col",
        HEIGHT[size],
        // Appearance
        "bg-background-default rounded-card border",
        // State — border/shadow
        disabled
          ? "border-border-subtle opacity-50 cursor-not-allowed"
          : [
              "border-border-subtle",
              // CSS :focus-within fires when the textarea inside is focused
              "focus-within:border-border-brand",
              "focus-within:shadow-input-active",
              "transition-shadow duration-150",
            ].join(" "),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ── Textarea ─────────────────────────────────────────────────────── */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxChars}
        aria-label="Skincare concern"
        className={[
          // Fills remaining height above the bottom bar
          "flex-1 w-full resize-none",
          // Spacing — left/right/top mirrors Figma InputBox padding (20px)
          "px-5 pt-5",
          // Typography
          "text-paragraph-m font-sans leading-paragraph",
          "text-text-primary",
          "placeholder:text-text-muted",
          // No native outline — wrapper handles focus ring
          "outline-none bg-transparent",
          disabled ? "cursor-not-allowed" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />

      {/* ── Bottom bar: counter + send button ────────────────────────────── */}
      <div className="flex items-center justify-between shrink-0 px-4 pb-4 pt-1">

        {/* Character counter — visible only while user is typing */}
        {hasText ? (
          <span className="text-label-s font-sans leading-label text-text-muted tabular-nums">
            {count}/{maxChars}
          </span>
        ) : (
          /* Spacer keeps send button right-aligned even when counter is hidden */
          <span aria-hidden="true" />
        )}

        {/*
          Send button — reuses Button component directly.

          · Empty  → disabled=true  → Button renders in its disabled state
                      (gray bg, muted text, not clickable, cursor-not-allowed)
          · Typing → disabled=false → Button renders in its active primary state
                      (gold bg, white icon, hover/pressed overlays, focusable)

          transition-colors duration-150 is already in Button's BASE class,
          so the locked→unlocked colour change animates automatically.

          size-9 + !px-0 !py-0 collapses Button's default sm padding to zero,
          leaving a 36×36 px circle (rounded-pill on a square = perfect circle).
        */}
        <Button
          variant="primary"
          size="sm"
          disabled={disabled || !hasText}
          onClick={handleSend}
          aria-label="Send message"
          className="size-10 md:size-9 !px-0 !py-0 shrink-0"
        >
          <IconSend />
        </Button>
      </div>
    </div>
  )
}
