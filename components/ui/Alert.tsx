import { Info, XCircle, AlertTriangle, CheckCircle } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type AlertVariant = "info" | "error" | "warning" | "success"
export type AlertLang = "sr" | "en"

export interface AlertProps {
  variant: AlertVariant
  /** Display language — controls which default copy is shown */
  lang?: AlertLang
  /** Overrides the built-in copy for this variant + lang */
  message?: string
  className?: string
}

// ─── Copy ─────────────────────────────────────────────────────────────────────

const COPY: Record<AlertVariant, Record<AlertLang, string>> = {
  info: {
    sr: "Ovo je AI savetnik, ne medicinski stručnjak. Za ozbiljne ili trajne promene na koži, konsultuj dermatologa.",
    en: "This is AI-powered guidance, not medical advice. For persistent or serious skin concerns, please consult a dermatologist.",
  },
  error: {
    sr: "Nešto nije pošlo kako treba. Pokušaj ponovo za nekoliko sekundi.",
    en: "Something went wrong. Please try again in a few seconds.",
  },
  warning: {
    sr: "Za ovaj problem trenutno nemamo proizvod koji bismo preporučili. Naš tim radi na proširenju asortimana — slobodno nam piši na Instagramu.",
    en: "We don't currently have a product that matches this concern. Our team is always expanding the range — feel free to reach out on Instagram.",
  },
  success: {
    sr: "Rutina je kreirana na osnovu tvojih odgovora.",
    en: "Your routine has been built based on your answers.",
  },
}

// ─── Variant config ───────────────────────────────────────────────────────────

/**
 * Maps each variant to its bg + border tokens and its Lucide icon.
 * Icon colour is set via the `color` prop (exact hex from Figma token).
 * All bg/border tokens are from globals.css @theme → color/feedback/*.
 */
const CONFIG: Record<
  AlertVariant,
  { wrapper: string; icon: React.ReactElement }
> = {
  info: {
    wrapper: "bg-feedback-info-100 border-feedback-info-300",
    // Info blue — reads against #EFF6FF bg
    icon: <Info size={16} color="#1d4ed8" aria-hidden="true" />,
  },
  error: {
    wrapper: "bg-feedback-error-100 border-feedback-error-300",
    // Error red — reads against #FEE2E2 bg
    icon: <XCircle size={16} color="#dc2626" aria-hidden="true" />,
  },
  warning: {
    wrapper: "bg-feedback-warning-100 border-feedback-warning-300",
    // Warning amber — reads against #FEF3C7 bg
    icon: <AlertTriangle size={16} color="#92400e" aria-hidden="true" />,
  },
  success: {
    wrapper: "bg-feedback-success-100 border-feedback-success-300",
    // Success green — reads against #D1FAE5 bg
    icon: <CheckCircle size={16} color="#065f46" aria-hidden="true" />,
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Alert({
  variant,
  lang = "en",
  message,
  className,
}: AlertProps) {
  const { wrapper, icon } = CONFIG[variant]
  const text = message ?? COPY[variant][lang]

  return (
    <div
      role="alert"
      className={[
        // Layout — Figma: padding 12px 16px, full width
        "flex items-start gap-3 w-full px-4 py-3 md:px-5 md:py-4",
        // Shape — rounded-alert = 8px from @theme
        "rounded-alert border",
        // Variant colours
        wrapper,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Icon — mt-px nudges it to optically align with the text cap-height */}
      <span className="shrink-0 mt-px">{icon}</span>

      {/* Message */}
      <p className="text-paragraph-s font-sans leading-paragraph text-text-primary">
        {text}
      </p>
    </div>
  )
}
