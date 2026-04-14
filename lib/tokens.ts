/**
 * DOBAR design system — bee's care AI Skin Advisor
 *
 * Single source of truth for all design tokens.
 * Values mirror the Figma file exactly: dobar.system--Copy-
 *
 * JSDoc on every value shows the original Figma token path (slash-separated).
 * CSS custom properties in globals.css are derived from these constants.
 * Tailwind v4 utilities are generated from those CSS variables.
 *
 * Mapping convention:
 *   Figma path          → CSS variable               → Tailwind utility
 *   color/text/primary  → --color-text-primary       → text-text-primary
 *   typography/h1       → --text-h1                  → text-h1
 *   radius/9999         → --radius-pill              → rounded-pill
 */

// ─── Colors ──────────────────────────────────────────────────────────────────

/** color/background/* */
export const colorBackground = {
  /** color/background/subtle — page body, main content area */
  subtle: '#f7f6f5',
  /** color/background/default — nav bar, cards, input boxes */
  default: '#ffffff',
  /** color/background/inverse — footer */
  inverse: '#110f10',
  /** color/background/brand — active input send button */
  brand: '#f7f2ec',
} as const

/** color/text/* */
export const colorText = {
  /** color/text/primary — headings, active input text */
  primary: '#110f10',
  /** color/text/secondary — body copy, labels, placeholder text */
  secondary: '#4b4846',
  /** color/text/muted — footer copy, pills, disabled states */
  muted: '#8c8885',
} as const

/** color/border/* */
export const colorBorder = {
  /** color/border/subtle — default card and input borders */
  subtle: '#efedec',
  /** color/border/strong — active/focused input border */
  strong: '#c9c5c2',
  /** color/border/brand — quiz card selected state, primary button focus */
  brand: '#c2986b',
  /** color/border/focus — primary button focused ring */
  focus: '#b0865e',
} as const

/** color/button/primary/* */
export const colorButtonPrimary = {
  /** color/button/primary/bg */
  bg: '#c2986b',
  /** color/button/primary/text */
  text: '#ffffff',
  /** color/button/primary/text-disabled */
  textDisabled: '#8c8885',
} as const

/** color/button/outline/* */
export const colorButtonOutline = {
  /** color/button/outline/border */
  border: '#a8a29e',
  /** color/button/outline/border-disabled */
  borderDisabled: 'rgba(0, 0, 0, 0.1)',
  /** color/button/outline/text */
  text: '#000000',
  /** color/button/outline/text-disabled */
  textDisabled: '#8c8885',
} as const

/** color/interaction/* */
export const colorInteraction = {
  /** color/interaction/hover — 5% black overlay on hover */
  hover: 'rgba(0, 0, 0, 0.05)',
  /** color/interaction/pressed — 20% black overlay on press */
  pressed: 'rgba(0, 0, 0, 0.2)',
  /** color/interaction/focus-ring — outlined button focused border */
  focusRing: '#c9a274',
  /** color/interaction/disabled — disabled button background */
  disabled: 'rgba(0, 0, 0, 0.1)',
} as const

/** color/alpha/black/* */
export const colorAlpha = {
  /** color/alpha/black/10 */
  black10: 'rgba(0, 0, 0, 0.1)',
  /** color/alpha/black/5 — hover overlay */
  black5: 'rgba(0, 0, 0, 0.05)',
  /** color/alpha/black/20 — pressed overlay */
  black20: 'rgba(0, 0, 0, 0.2)',
} as const

/** color/feedback/* */
export const colorFeedback = {
  /** color/feedback/info/100 — Info alert background */
  info100: '#eff6ff',
  /** color/feedback/info/300 — Info alert border */
  info300: '#bcdbff',
  /** color/feedback/error/100 — Error alert background */
  error100: '#fee2e2',
  /** color/feedback/error/300 — Error alert border */
  error300: '#fca5a5',
  /** color/feedback/warning/100 — Warning alert background */
  warning100: '#fef3c7',
  /** color/feedback/warning/300 — Warning alert border */
  warning300: '#fcd34d',
  /** color/feedback/success/100 — Success alert background */
  success100: '#d1fae5',
  /** color/feedback/success/300 — Success alert border */
  success300: '#6ee7b7',
} as const

/** DOBAR brand logotype colors */
export const colorBrand = {
  /** "DO" in DOBAR logotype — amber/orange */
  dobarOrange: '#f9a271',
  /** "BAR" in DOBAR logotype — white */
  dobarWhite: '#ffffff',
} as const

// ─── Typography ───────────────────────────────────────────────────────────────

/** typography/font-family/* */
export const fontFamily = {
  /**
   * typography/font-family/helvetica-now-display
   * Primary typeface — requires commercial license.
   * Falls back to Helvetica Neue / Arial.
   */
  sans: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
  /**
   * Sora ExtraBold — DOBAR logotype only.
   * Loaded via Next.js font loader; CSS var --font-sora is set on <html>.
   */
  dobar: '"Sora", sans-serif',
} as const

/** typography/font-weight/* */
export const fontWeight = {
  /** typography/font-weight/regular — paragraphs, placeholder, label-regular */
  regular: 400,
  /** typography/font-weight/medium — headings, labels, buttons */
  medium: 500,
  /** ExtraBold 800 — Sora for DOBAR logotype */
  extrabold: 800,
} as const

/**
 * typography/font-size/*
 *
 * Tailwind utility mapping (via @theme --text-* variables):
 *   text-display-xl, text-display-l, text-display-m
 *   text-h1 … text-h6
 *   text-paragraph-xl, text-paragraph-m, text-paragraph-s
 *   text-label-xl, text-label-m, text-label-s
 */
export const fontSize = {
  /** typography/font-size/display-xl — 80px */
  displayXl: '80px',
  /** typography/font-size/display-l — 64px */
  displayL: '64px',
  /** typography/font-size/display-m — 48px */
  displayM: '48px',
  /** typography/font-size/h1 — 32px */
  h1: '32px',
  /** typography/font-size/h2 — 28px */
  h2: '28px',
  /** typography/font-size/h3 — 24px */
  h3: '24px',
  /** typography/font-size/h4 — 20px */
  h4: '20px',
  /** typography/font-size/h5 — 18px */
  h5: '18px',
  /** typography/font-size/h6 — 16px */
  h6: '16px',
  /** typography/font-size/paragraph-xl — 18px */
  paragraphXl: '18px',
  /** typography/font-size/paragraph-m — 16px */
  paragraphM: '16px',
  /** typography/font-size/paragraph-s — 14px */
  paragraphS: '14px',
  /** typography/font-size/label-xl — 14px */
  labelXl: '14px',
  /** typography/font-size/label-m — 13px */
  labelM: '13px',
  /** typography/font-size/label-s — 12px */
  labelS: '12px',
} as const

/**
 * typography/line-height/*
 *
 * Tailwind utility mapping (via @theme --leading-* variables):
 *   leading-display   → 1.2 (display sizes and labels)
 *   leading-headline  → 1.3 (h1–h6)
 *   leading-paragraph → 1.5 (body copy) — same as Tailwind's leading-normal
 *   leading-label     → 1.2 (labels)
 */
export const lineHeight = {
  /** typography/line-height for display-* and label-* — 1.2 */
  display: 1.2,
  /** typography/line-height for h1–h6 — 1.3 */
  headline: 1.3,
  /** typography/line-height for paragraph-* — 1.5 */
  paragraph: 1.5,
  /** typography/line-height for label-* — 1.2 */
  label: 1.2,
} as const

// ─── Spacing ──────────────────────────────────────────────────────────────────

/**
 * spacing/* — pixel values from Figma
 *
 * All values divide evenly by 4, mapping to Tailwind v4's default spacing scale
 * (base unit = 4px, so spacing-N = N × 4px):
 *
 *   spacing/8   (8px)   → gap-2   p-2   (2 × 4)
 *   spacing/12  (12px)  → gap-3   p-3   (3 × 4)
 *   spacing/16  (16px)  → gap-4   p-4   (4 × 4)
 *   spacing/20  (20px)  → gap-5   p-5   (5 × 4)
 *   spacing/24  (24px)  → gap-6   p-6   (6 × 4)
 *   spacing/32  (32px)  → gap-8   p-8   (8 × 4)
 *   spacing/40  (40px)  → gap-10  p-10  (10 × 4)
 *   spacing/44  (44px)  → gap-11  p-11  (11 × 4)
 *   spacing/48  (48px)  → gap-12  p-12  (12 × 4)
 *   spacing/52  (52px)  → gap-13  py-13 (13 × 4)
 *   spacing/64  (64px)  → gap-16  p-16  (16 × 4)
 *   spacing/100 (100px) → py-25        (25 × 4)
 *
 * Use this object as a reference when writing Tailwind classes.
 * Do not override Tailwind's default spacing scale.
 */
export const spacing = {
  /** spacing/8 */
  8: 8,
  /** spacing/10 */
  10: 10,
  /** spacing/12 */
  12: 12,
  /** spacing/16 */
  16: 16,
  /** spacing/20 — input left/top padding */
  20: 20,
  /** spacing/24 — card inner padding, also used as border-radius */
  24: 24,
  /** spacing/32 */
  32: 32,
  /** spacing/40 — page horizontal padding */
  40: 40,
  /** spacing/44 — button height */
  44: 44,
  /** spacing/48 — active send button width */
  48: 48,
  /** spacing/52 — footer vertical padding */
  52: 52,
  /** spacing/64 — gap between major content sections */
  64: 64,
  /** spacing/100 — main content vertical padding */
  100: 100,
} as const

// ─── Border radius ────────────────────────────────────────────────────────────

/**
 * radius/*
 *
 * Tailwind utility mapping (via @theme --radius-* variables):
 *   rounded-alert → 8px    (Figma: radius/8)
 *   rounded-card  → 24px   (Figma: spacing/24 used as border-radius)
 *   rounded-pill  → 9999px (Figma: radius/9999)
 *
 * Tailwind built-in aliases that also work:
 *   rounded-lg   = 8px   (alerts)
 *   rounded-3xl  = 24px  (cards, inputs)
 *   rounded-full = 9999px (buttons, pills)
 */
export const borderRadius = {
  /** radius/8 — Alert components */
  alert: '8px',
  /** spacing/24 as border-radius — Cards, input boxes, quiz answer cards */
  card: '24px',
  /** radius/9999 — Buttons, pills, language picker */
  pill: '9999px',
} as const

// ─── Shadows ──────────────────────────────────────────────────────────────────

export const shadows = {
  /**
   * M3/Elevation Light/1
   * Applied to InputBox in Active state.
   * Tailwind utility: shadow-input-active
   */
  inputActive:
    '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
} as const

// ─── Sizes (fixed dimensions from Figma) ──────────────────────────────────────

export const sizes = {
  /** Content column max-width — 748px */
  contentWidth: '748px',
  /** Full desktop canvas width — 1512px */
  desktopWidth: '1512px',
  /** bee's care logo: 195 × 49px */
  logoWidth: '195px',
  logoHeight: '49px',
  /** Button height — 44px */
  buttonHeight: '44px',
  /** Big input box height — 162px */
  inputBig: '162px',
  /** Small input box height — 106px */
  inputSmall: '106px',
  /** Language picker width — 131px */
  languagePickerWidth: '131px',
  /** Active send button (pill) width — 48px */
  sendButtonActive: '48px',
  /** Standard icon size — 20px */
  iconMd: '20px',
  /** Large icon size — 24px */
  iconLg: '24px',
  /** Loading spinner size — 44px */
  spinner: '44px',
  /** Quiz card width — 364px */
  quizCard: '364px',
  /** Question card width — 487px */
  questionCard: '487px',
} as const

// ─── Consolidated export ──────────────────────────────────────────────────────

export const tokens = {
  color: {
    background: colorBackground,
    text: colorText,
    border: colorBorder,
    button: {
      primary: colorButtonPrimary,
      outline: colorButtonOutline,
    },
    interaction: colorInteraction,
    alpha: colorAlpha,
    feedback: colorFeedback,
    brand: colorBrand,
  },
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  spacing,
  borderRadius,
  shadows,
  sizes,
} as const

export type Tokens = typeof tokens
