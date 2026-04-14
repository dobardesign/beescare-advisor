"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Leaf, HelpCircle, Lightbulb } from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { LoadingIndicator } from "@/components/ui/LoadingIndicator"
import { QuestionCard } from "@/components/ui/QuestionCard"
import { ProductCard } from "@/components/ui/ProductCard"
import { type BadgeType } from "@/components/ui/ProductCard"
import { type Lang } from "@/components/ui/LanguagePicker"
import { DEFAULT_LANG, getSavedLang, saveLang } from "@/lib/language"
import { PRODUCTS } from "@/lib/products"

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductRecommendation {
  id?: string
  name: string
  reason: string
  ingredients: string[]
  url: string
  badge: "Best match" | "Good pair" | "Nice addon"
}

interface AIResponseData {
  intro: string
  advice: string
  products: ProductRecommendation[]
  tip: string
  showDisclaimer: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BADGE_MAP: Record<ProductRecommendation["badge"], BadgeType> = {
  "Best match": "best-match",
  "Good pair":  "good-pair",
  "Nice addon": "nice-addon",
}

// First card: image right (reverse=true), second: image left, third: image right
const imageReverse = (index: number) => index % 2 === 0

/**
 * Looks up a product image using strict ID-first matching.
 * 1. Exact ID match (most reliable — Claude is prompted to return correct IDs)
 * 2. Keyword fragments in the name or ID as a fallback
 */
const ID_KEYWORD_MAP: Record<string, string> = {
  umivalica:   "umivalica",
  hidratantna: "hidratantna-krema",
  antirid:     "antirid-krema",
  bora:        "antirid-krema",
  ekcem:       "melem-ekcem",
  obnov:       "melem-obnova",
  usne:        "balzam-usne",
  balzam:      "balzam-usne",
  kokos:       "puter-kokos",
  pomorandz:   "puter-pomorandza",
  piling:      "piling-cokolada",
  ruke:        "krema-ruke",
  mandarin:    "dezodorans-mandarina",
  "iglice":    "dezodorans-bor",
  spf:         "spf-krema",
  suncanj:     "ulje-suncanje",
}

function getProductImage(productId: string | undefined, productName: string): string {
  // 1. Exact ID match
  if (productId) {
    const exact = PRODUCTS.find(p => p.id === productId)
    if (exact?.imageUrl) return exact.imageUrl
  }

  // 2. Keyword fallback
  const lowerName = productName.toLowerCase()
  const lowerId   = (productId ?? "").toLowerCase()

  for (const [key, id] of Object.entries(ID_KEYWORD_MAP)) {
    if (lowerName.includes(key) || lowerId.includes(key)) {
      const product = PRODUCTS.find(p => p.id === id)
      if (product?.imageUrl) return product.imageUrl
    }
  }

  return "/images/product-placeholder.svg"
}

// ─── Copy ─────────────────────────────────────────────────────────────────────

const COPY = {
  eyebrow:     { sr: "Zdravo!",                                       en: "Hi there!" },
  h1:          { sr: "Kako mogu da pomognem tvojoj koži danas?",       en: "How can I help your skin today?" },
  placeholder: { sr: "Na primer: imam suvu kožu i sitne bore...",      en: "For example: I have dry skin and fine lines..." },
  quizChip:    { sr: "Skincare rutina upitnik",                        en: "Skincare routine quiz" },
  poweredBy:   { sr: "Powered by natural ingredient knowledge",        en: "Powered by natural ingredient knowledge" },
  visitSite:   { sr: "Poseti sajt",                                    en: "Visit website" },
  followUp:    { sr: "Na primer: ima li nešto za osetljivu kožu...",   en: "For example: anything for sensitive skin..." },
  learnMore:   { sr: "Saznaj više",                                    en: "Learn more" },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Homepage() {
  const router = useRouter()

  // ── State
  const [lang, setLang]               = useState<Lang>(DEFAULT_LANG)
  const [question, setQuestion]       = useState("")
  const [aiResponse, setAiResponse]   = useState<AIResponseData | null>(null)
  const [isLoading, setIsLoading]     = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError]             = useState(false)

  const t = (key: keyof typeof COPY) => COPY[key][lang]

  // ── Language persistence
  useEffect(() => { setLang(getSavedLang()) }, [])

  const handleLangChange = (newLang: Lang) => {
    setLang(newLang)
    saveLang(newLang)
  }

  // ── Handlers

  async function handleSend(value: string) {
    if (!value.trim()) return
    console.log("TRACK: chat_question_submitted", { questionLength: value.length, lang })
    setQuestion(value)
    setHasSubmitted(true)
    setIsLoading(true)
    setAiResponse(null)
    setError(false)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: value, lang }),
      })

      if (!res.ok) throw new Error("API error")

      const data: AIResponseData = await res.json()
      setAiResponse(data)
    } catch {
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }

  function handleEdit() {
    setHasSubmitted(false)
    setAiResponse(null)
    setIsLoading(false)
    setError(false)
  }

  // ── Render

  return (
    <div className="flex flex-col min-h-screen bg-background-subtle">

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <Navbar lang={lang} onLangChange={handleLangChange} />

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center px-5 md:px-10 py-16 md:py-[100px]">
        <div className="w-full max-w-[748px] flex flex-col gap-8 md:gap-16">

          {/* ════════════════════════════════════════════════════════════
              STATE 1 — Empty / default
          ════════════════════════════════════════════════════════════ */}
          {!hasSubmitted && (
            <>
              {/* Text + input block */}
              <div className="flex flex-col gap-6">

                {/* Eyebrow + H1 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Leaf size={20} color="#c2986b" aria-hidden="true" />
                    <span className="text-label-m font-sans font-medium leading-label text-text-secondary">
                      {t("eyebrow")}
                    </span>
                  </div>

                  <h1 className="text-h2 md:text-h1 font-sans font-medium leading-headline text-text-primary">
                    {t("h1")}
                  </h1>
                </div>

                {/* Input — big (162px), full width */}
                <Input
                  size="default"
                  placeholder={t("placeholder")}
                  onSend={handleSend}
                  maxChars={500}
                />

                {/* Quiz chip — full width on mobile, auto on desktop */}
                <Button
                  variant="outlined"
                  size="default"
                  iconLeft={<HelpCircle size={16} aria-hidden="true" />}
                  onClick={() => router.push("/quiz")}
                  className="w-full md:w-auto md:self-start"
                >
                  {t("quizChip")}
                </Button>
              </div>

              {/* Info row */}
              <div className="flex flex-col gap-6">
                {/* Mobile: stacked + centered. Desktop: side-by-side */}
                <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
                  <div className="flex items-center gap-[10px]">
                    <Leaf size={16} color="#c2986b" aria-hidden="true" />
                    <span className="text-label-m font-sans font-medium leading-label text-text-secondary">
                      {t("poweredBy")}
                    </span>
                  </div>

                  <a
                    href="https://beescare.rs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-label-xl font-sans font-medium leading-label text-text-primary underline decoration-solid hover:text-text-secondary transition-colors duration-150"
                  >
                    {t("visitSite")}
                  </a>
                </div>
              </div>
            </>
          )}

          {/* ════════════════════════════════════════════════════════════
              STATE 2 — After question submitted
          ════════════════════════════════════════════════════════════ */}
          {hasSubmitted && (
            <div className="flex flex-col gap-8">

              {/* Question card — right-aligned */}
              <div className="flex justify-end">
                <QuestionCard
                  question={question}
                  onEdit={handleEdit}
                />
              </div>

              {/* ── Loading ─────────────────────────────────────────── */}
              {isLoading && (
                <LoadingIndicator lang={lang} />
              )}

              {/* ── Error ───────────────────────────────────────────── */}
              {error && !isLoading && (
                <Alert variant="error" lang={lang} />
              )}

              {/* ── Structured response ─────────────────────────────── */}
              {aiResponse && !isLoading && (
                <div className="flex flex-col gap-8">

                  {/* ── Intro ──────────────────────────────────────── */}
                  {aiResponse.intro && (
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        <Leaf size={18} color="#c2986b" aria-hidden="true" />
                      </div>
                      <p className="text-paragraph-m font-sans leading-paragraph text-text-primary">
                        {aiResponse.intro}
                      </p>
                    </div>
                  )}

                  {/* ── Advice ─────────────────────────────────────── */}
                  {aiResponse.advice && (
                    <p className="text-paragraph-s font-sans leading-paragraph text-text-secondary italic">
                      {aiResponse.advice}
                    </p>
                  )}

                  {/* ── Product cards ──────────────────────────────── */}
                  {aiResponse.products && aiResponse.products.length > 0 && (
                    <div className="flex flex-col gap-4">
                      {aiResponse.products.map((product, index) => (
                        // Wrapper div captures any click inside the card for tracking.
                        // ProductCard handles "Learn more" navigation internally.
                        <div
                          key={`${product.name}-${index}`}
                          onClick={() => console.log("TRACK: product_link_clicked", { productName: product.name, source: "chat", lang })}
                        >
                          <ProductCard
                            badge={BADGE_MAP[product.badge] ?? "best-match"}
                            image={getProductImage(product.id, product.name)}
                            imageAlt={product.name}
                            name={product.name}
                            description={product.reason}
                            highlights={product.ingredients}
                            href={product.url}
                            reverse={imageReverse(index)}
                            lang={lang}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Tip ────────────────────────────────────────── */}
                  {aiResponse.tip && (
                    <div className="flex items-start gap-2">
                      <Lightbulb
                        size={16}
                        className="shrink-0 mt-0.5 text-text-secondary"
                        aria-hidden="true"
                      />
                      <p className="text-paragraph-s font-sans leading-paragraph text-text-secondary">
                        {aiResponse.tip}
                      </p>
                    </div>
                  )}

                  {/* ── Medical disclaimer ─────────────────────────── */}
                  {aiResponse.showDisclaimer && (
                    <Alert variant="info" lang={lang} />
                  )}

                </div>
              )}

              {/* ── Follow-up input (shown after response or error) ── */}
              {(aiResponse || error) && !isLoading && (
                <div className="flex flex-col gap-4">
                  <Input
                    size="sm"
                    placeholder={t("followUp")}
                    onSend={handleSend}
                    maxChars={500}
                  />

                  <Button
                    variant="outlined"
                    size="default"
                    iconLeft={<HelpCircle size={16} aria-hidden="true" />}
                    onClick={() => router.push("/quiz")}
                    className="w-full md:w-auto md:self-start"
                  >
                    {t("quizChip")}
                  </Button>
                </div>
              )}

            </div>
          )}

        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <Footer />

    </div>
  )
}
