"use client"

import { useState, useEffect, type CSSProperties } from "react"
import {
  HelpCircle, ArrowLeft, ArrowRight,
  Sun, Moon, CalendarDays, Leaf,
  RotateCcw, ExternalLink, CheckCircle,
} from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/Button"
import { QuizAnswerCard } from "@/components/ui/QuizAnswerCard"
import { LoadingIndicator } from "@/components/ui/LoadingIndicator"
import { Alert } from "@/components/ui/Alert"
import { type Lang } from "@/components/ui/LanguagePicker"
import { DEFAULT_LANG, getSavedLang, saveLang } from "@/lib/language"
import { track } from "@/lib/analytics"
import { QUIZ_QUESTIONS, type QuizAnswers } from "@/lib/quiz-questions"
import { WhereToBuy } from "@/components/ui/WhereToBuy"
import type { Product } from "@/lib/products"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Recommendations {
  morningRoutine:  Product[]
  eveningRoutine:  Product[]
  weeklyRoutine:   Product[]
  primaryProducts: Product[]
}

interface QuizApiResult {
  intro: string
  recommendations: Recommendations
  seasonalTip: string
  lang: string
}

// ─── Copy ─────────────────────────────────────────────────────────────────────

const COPY = {
  // ── Quiz flow
  eyebrow:           { sr: "Skincare rutina upitnik",                               en: "Skincare routine quiz" },
  h1:                { sr: "Pronađi svoju idealnu rutinu",                           en: "Find your ideal skincare routine" },
  question:          { sr: "Pitanje",                                               en: "Question" },
  previous:          { sr: "Prethodno pitanje",                                     en: "Previous question" },
  next:              { sr: "Sledeće pitanje",                                       en: "Next question" },
  seeResults:        { sr: "Vidi rezultate",                                        en: "See results" },
  restart:           { sr: "Počni ponovo",                                          en: "Start over" },
  // ── Results header
  readyBadge:        { sr: "Tvoja rutina je spremna",                               en: "Your routine is ready" },
  profileTitle:      { sr: "Tvoj skincare profil",                                  en: "Your skincare profile" },
  // ── Results sections
  routineTitle:      { sr: "Tvoja dnevna rutina",                                   en: "Your daily routine" },
  routineSubtitle:   { sr: "Redosled je bitan — nanosite od najlakseg ka najtezem", en: "Order matters — apply from lightest to heaviest" },
  morningCol:        { sr: "Jutro",                                                 en: "Morning" },
  eveningCol:        { sr: "Vece",                                                  en: "Evening" },
  weeklyTitle:       { sr: "Nedeljna nega",                                         en: "Weekly care" },
  seasonalLabel:     { sr: "Savet za ovo godišnje doba",                            en: "Tip for this season" },
  profileBasedTitle: { sr: "Na osnovu tvog profila",                                en: "Based on your profile" },
  profileBasedSub:   {
    sr: "Na osnovu tvojih odgovora, preporučujemo da u narednom periodu uvrsteš sledeće bee's care proizvode u svoju rutinu:",
    en: "Based on your answers, we recommend gradually adding these bee's care products to your routine:",
  },
  viewProducts:      { sr: "Pogledaj proizvode",                                    en: "View products" },
}

const LOADING_PHASES: Record<Lang, string[]> = {
  sr: [
    "Analiziramo tvoje odgovore...",
    "Kreiramo tvoju rutinu...",
    "Biramo prave proizvode...",
    "Pripremamo preporuku...",
  ],
  en: [
    "Analyzing your answers...",
    "Creating your routine...",
    "Selecting the right products...",
    "Preparing your recommendation...",
  ],
}

// ─── Answer → readable label mapping ─────────────────────────────────────────

const ANSWER_LABELS: Record<string, Record<string, { sr: string; en: string }>> = {
  skin_type: {
    dry:         { sr: "Suva koža",       en: "Dry skin" },
    oily:        { sr: "Masna koža",      en: "Oily skin" },
    combination: { sr: "Kombinovana",     en: "Combination" },
    sensitive:   { sr: "Osetljiva koža",  en: "Sensitive skin" },
  },
  primary_concern: {
    dryness: { sr: "Dehidracija",  en: "Dehydration" },
    aging:   { sr: "Anti-aging",   en: "Anti-aging" },
    eczema:  { sr: "Ekcem",        en: "Eczema" },
    spots:   { sr: "Fleke",        en: "Dark spots" },
  },
  sun_exposure: {
    low:         { sr: "Malo sunca",          en: "Low sun exposure" },
    medium:      { sr: "Umereno sunce",        en: "Moderate sun" },
    high:        { sr: "Dosta sunca",          en: "High sun exposure" },
    seeking_spf: { sr: "Traži prirodni SPF",   en: "Seeking natural SPF" },
  },
}

// ─── Routine step context descriptions ───────────────────────────────────────

const STEP_CONTEXT: Record<string, { sr: string; en: string }> = {
  "umivalica":            { sr: "Cisti i priprema kožu za naredne korake",          en: "Cleanses and preps skin for next steps" },
  "hidratantna-krema":    { sr: "Hidrira i stvara zaštitni omotač",                 en: "Hydrates and creates a protective barrier" },
  "antirid-krema":        { sr: "Regeneriše i smanjuje bore tokom noći",             en: "Regenerates and reduces wrinkles overnight" },
  "melem-ekcem":          { sr: "Smiruje upalu i ubrzava oporavak kože",             en: "Soothes inflammation and speeds skin recovery" },
  "melem-obnova":         { sr: "Antiseptičko dejstvo, celi i obnavlja",             en: "Antiseptic action, heals and renews skin" },
  "spf-krema":            { sr: "Prirodna UV zaštita bez belog traga",               en: "Natural UV protection with no white cast" },
  "balzam-usne":          { sr: "Nega i zaštita usana tokom dana",                   en: "Lip care and protection throughout the day" },
  "puter-kokos":          { sr: "Duboka hidratacija tela, pomaže sa strijama",       en: "Deep body hydration, helps with stretch marks" },
  "puter-pomorandza":     { sr: "Elastičnost i hidratacija, miris pomorandže",       en: "Elasticity and hydration, orange scent" },
  "piling-cokolada":      { sr: "Uklanja mrtve ćelije, koža postaje glatka",         en: "Removes dead cells, skin becomes smooth" },
  "krema-ruke":           { sr: "Regeneriše i hidrira ruke, brzo se upija",          en: "Regenerates and hydrates hands, absorbs quickly" },
  "dezodorans-mandarina": { sr: "Prirodna zaštita bez aluminijuma",                  en: "Natural protection without aluminum" },
  "dezodorans-bor":       { sr: "Prirodna zaštita, miris borovine",                  en: "Natural protection, pine scent" },
  "ulje-suncanje":        { sr: "Produžava tan — uvek nanosi posle SPF kreme",       en: "Extends tan — always apply after SPF cream" },
}

// ─── Weekly tips (based on body concern, not product list) ───────────────────

interface WeeklyTip {
  emoji: string
  title: { sr: string; en: string }
  desc:  { sr: string; en: string }
}

function getWeeklyTips(bodyConcern: string | undefined): WeeklyTip[] {
  if (bodyConcern === "dry_body" || bodyConcern === "stretch_marks") {
    return [
      {
        emoji: "🧴",
        title: { sr: "Piling pre tuša",   en: "Scrub before shower" },
        desc: {
          sr: "Piling za telo 1-2x nedeljno uklanja mrtve ćelije i priprema kožu da bolje upije Puter za telo.",
          en: "Body scrub 1-2x weekly removes dead cells and prepares skin to better absorb Body Butter.",
        },
      },
      {
        emoji: "🛁",
        title: { sr: "Puter posle tuša",   en: "Butter after shower" },
        desc: {
          sr: "Nanesite Puter za telo odmah posle tuša dok je koža još blago vlažna — upija se duplo bolje.",
          en: "Apply Body Butter right after showering while skin is still slightly damp — absorbs twice as well.",
        },
      },
    ]
  }

  if (bodyConcern === "hands") {
    return [
      {
        emoji: "💧",
        title: { sr: "Krema za ruke posle pranja",   en: "Hand cream after washing" },
        desc: {
          sr: "Svaki put posle pranja ruku nanesite Kremu za ruke. Držite je pored sudopere kao podsetnik.",
          en: "Every time after washing hands apply Hand Cream. Keep it next to the sink as a reminder.",
        },
      },
    ]
  }

  // Default: no specific body concern
  return [
    {
      emoji: "🧴",
      title: { sr: "Piling jednom nedeljno",     en: "Scrub once a week" },
      desc: {
        sr: "Jednom nedeljno uradite piling lica ili tela za bolju cirkulaciju i sjajniju kožu.",
        en: "Once a week do a face or body scrub for better circulation and glowing skin.",
      },
    },
    {
      emoji: "💧",
      title: { sr: "Voda je osnova sve nege",   en: "Water is the foundation" },
      desc: {
        sr: "Pijte 8 čaša vode dnevno — nijedna krema ne može nadoknaditi dehidraciju iznutra.",
        en: "Drink 8 glasses of water daily — no cream can compensate for dehydration from within.",
      },
    },
  ]
}

// ─── Profile tag helper ───────────────────────────────────────────────────────

function getProfileTags(answers: QuizAnswers, lang: Lang): string[] {
  return (["skin_type", "primary_concern", "sun_exposure"] as const)
    .map(key => {
      const val = answers[key]
      if (!val) return null
      return ANSWER_LABELS[key]?.[val]?.[lang] ?? null
    })
    .filter(Boolean) as string[]
}

// ─── SectionHeader ────────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-h3 md:text-h2 font-sans font-medium leading-headline text-text-primary">
        {title}
      </h2>
      {subtitle && (
        <p className="text-paragraph-s font-sans leading-paragraph text-text-secondary">
          {subtitle}
        </p>
      )}
    </div>
  )
}

// ─── RoutineStepRow ───────────────────────────────────────────────────────────
// Product name is a gold link to the product page; reason text is not clickable.

function RoutineStepRow({
  step,
  product,
  isLast,
  lang,
}: {
  step: number
  product: Product
  isLast: boolean
  lang: Lang
}) {
  const reason = STEP_CONTEXT[product.id]?.[lang]
  const name   = lang === "sr" ? product.nameSr : product.nameEn

  return (
    <>
      <div className="flex items-start gap-3 py-4">
        {/* Gold step-number circle */}
        <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-button-primary-bg">
          <span className="text-label-s font-sans font-medium leading-label text-button-primary-text">
            {step}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          {/* Clickable product name — gold, underline on hover only */}
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-label-m font-sans font-medium leading-label text-border-brand no-underline hover:underline underline-offset-2 transition-colors duration-150 self-start"
            onClick={() => track("product_clicked", { product_name: name, source: "quiz", lang })}
          >
            {name}
          </a>
          {/* Italic reason — not clickable */}
          {reason && (
            <p className="text-paragraph-s font-sans leading-paragraph text-text-secondary italic">
              {reason}
            </p>
          )}
        </div>
      </div>
      {!isLast && <div className="border-t border-border-subtle" />}
    </>
  )
}

// ─── ResultsPage ──────────────────────────────────────────────────────────────
// All sections share bg-background-subtle.
// Only white-bg elements: routine cards, weekly tip cards, seasonal card, product list card.

function ResultsPage({
  result,
  lang,
  answers,
  onRestart,
}: {
  result: QuizApiResult
  lang: Lang
  answers: QuizAnswers
  onRestart: () => void
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(id)
  }, [])

  const t = (key: keyof typeof COPY) => COPY[key][lang]

  const anim = (delayMs: number): CSSProperties => ({
    opacity:    mounted ? 1 : 0,
    transform:  mounted ? "none" : "translateY(14px)",
    transition: `opacity 0.5s ease ${delayMs}ms, transform 0.5s ease ${delayMs}ms`,
  })

  const { intro, recommendations, seasonalTip } = result
  const { morningRoutine, eveningRoutine, primaryProducts } = recommendations

  const profileTags = getProfileTags(answers, lang)
  const hasMorning  = morningRoutine.length > 0
  const hasEvening  = eveningRoutine.length > 0
  const hasRoutine  = hasMorning || hasEvening
  const hasProducts = primaryProducts.length > 0

  // Weekly tips are always shown, derived from body_concern answer
  const weeklyTips = getWeeklyTips(answers.body_concern)

  return (
    <main className="flex-1 bg-background-subtle">

      {/* ── SECTION 1 ─ Personal profile header ────────────────────── */}
      <section
        className="bg-background-subtle border-b border-border-subtle"
        style={anim(0)}
      >
        <div className="max-w-[748px] mx-auto px-5 md:px-10 py-8 md:py-12 flex flex-col gap-6">

          {/* Success badge */}
          <div className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-feedback-success-100 border border-feedback-success-300">
            <CheckCircle size={12} color="#065f46" aria-hidden="true" />
            <span className="text-label-s font-sans font-medium leading-label text-text-secondary whitespace-nowrap">
              {t("readyBadge")}
            </span>
          </div>

          <h1 className="text-h2 md:text-h1 font-sans font-medium leading-headline text-text-primary">
            {t("profileTitle")}
          </h1>

          {/* Answer pills — gold border on subtle bg */}
          {profileTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profileTags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1.5 rounded-pill border border-border-brand bg-background-default text-label-s font-sans font-medium leading-label text-text-secondary whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION 2 ─ AI-written intro ────────────────────────────── */}
      {intro && (
        <section
          className="bg-background-subtle border-b border-border-subtle"
          style={anim(150)}
        >
          <div className="max-w-[748px] mx-auto px-5 md:px-10 py-6 md:py-10">
            <div className="flex items-start gap-4">
              <div className="shrink-0 mt-1">
                <Leaf size={18} color="#c2986b" aria-hidden="true" />
              </div>
              {/* line-height 1.7 per spec — not in our token scale */}
              <p
                className="text-paragraph-m font-sans text-text-primary"
                style={{ lineHeight: 1.7 }}
              >
                {intro}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 3 ─ Daily routine (2-column white cards) ────────── */}
      {hasRoutine && (
        <section
          className="bg-background-subtle border-b border-border-subtle"
          style={anim(300)}
        >
          <div className="max-w-[748px] mx-auto px-5 md:px-10 py-10 md:py-16 flex flex-col gap-8">
            <SectionHeader
              title={t("routineTitle")}
              subtitle={t("routineSubtitle")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Morning column — white card */}
              {hasMorning && (
                <div className="bg-background-default rounded-card border border-border-subtle overflow-hidden">
                  <div className="flex items-center gap-2 px-6 py-4 border-b border-border-subtle">
                    <Sun size={16} color="#c2986b" aria-hidden="true" />
                    <span className="text-label-m font-sans font-medium leading-label text-text-secondary">
                      {t("morningCol")}
                    </span>
                  </div>
                  <div className="px-6">
                    {morningRoutine.map((product, idx) => (
                      <RoutineStepRow
                        key={product.id}
                        step={idx + 1}
                        product={product}
                        isLast={idx === morningRoutine.length - 1}
                        lang={lang}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Evening column — white card */}
              {hasEvening && (
                <div className="bg-background-default rounded-card border border-border-subtle overflow-hidden">
                  <div className="flex items-center gap-2 px-6 py-4 border-b border-border-subtle">
                    <Moon size={16} color="#c2986b" aria-hidden="true" />
                    <span className="text-label-m font-sans font-medium leading-label text-text-secondary">
                      {t("eveningCol")}
                    </span>
                  </div>
                  <div className="px-6">
                    {eveningRoutine.map((product, idx) => (
                      <RoutineStepRow
                        key={product.id}
                        step={idx + 1}
                        product={product}
                        isLast={idx === eveningRoutine.length - 1}
                        lang={lang}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 4 ─ Weekly care (tip cards, always shown) ───────── */}
      <section
        className="bg-background-subtle border-b border-border-subtle"
        style={anim(450)}
      >
          <div className="max-w-[748px] mx-auto px-5 md:px-10 py-8 md:py-12 flex flex-col gap-6">
            <SectionHeader title={t("weeklyTitle")} />

          <div className="flex flex-col gap-4">
            {weeklyTips.map((tip, idx) => (
              <div
                key={idx}
                className="bg-background-default rounded-card border border-border-subtle px-6 py-5 flex items-start gap-4"
              >
                {/* Emoji icon — rendered as text for simplicity */}
                <span className="text-h4 leading-none shrink-0 mt-0.5" aria-hidden="true">
                  {tip.emoji}
                </span>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <p className="text-label-m font-sans font-medium leading-label text-text-primary">
                    {tip.title[lang]}
                  </p>
                  <p className="text-paragraph-s font-sans leading-paragraph text-text-secondary">
                    {tip.desc[lang]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5 ─ Seasonal tip (white card) ───────────────────── */}
      {seasonalTip && (
        <section
          className="bg-background-subtle border-b border-border-subtle"
          style={anim(560)}
        >
          <div className="max-w-[748px] mx-auto px-5 md:px-10 py-8 md:py-12">
            <div className="bg-background-default rounded-card border border-border-subtle px-6 py-5 flex items-start gap-4">
              <div className="shrink-0 mt-0.5">
                <CalendarDays size={20} color="#c2986b" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-label-m font-sans font-medium leading-label text-text-secondary">
                  {t("seasonalLabel")}
                </p>
                <p className="text-paragraph-m font-sans leading-paragraph text-text-primary">
                  {seasonalTip}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 6 ─ "Na osnovu tvog profila" product list ───────── */}
      {/* Replaces ProductCard section — simple gold text links in a white card */}
      {hasProducts && (
        <section
          className="bg-background-subtle border-b border-border-subtle"
          style={anim(640)}
        >
          <div className="max-w-[748px] mx-auto px-5 md:px-10 py-8 md:py-12 flex flex-col gap-6">
            <SectionHeader title={t("profileBasedTitle")} />

            <div className="bg-background-default rounded-card border border-border-subtle px-6 py-6 flex flex-col gap-5">
              <p className="text-paragraph-m font-sans leading-paragraph text-text-secondary">
                {t("profileBasedSub")}
              </p>

              <div className="flex flex-col gap-3">
                {primaryProducts.slice(0, 3).map(product => (
                  <a
                    key={product.id}
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-paragraph-m font-sans leading-paragraph text-border-brand no-underline hover:underline underline-offset-2 transition-colors duration-150 group self-start"
                    onClick={() => track("product_clicked", { product_name: lang === "sr" ? product.nameSr : product.nameEn, source: "quiz", lang })}
                  >
                    <span>{lang === "sr" ? product.nameSr : product.nameEn}</span>
                    <ArrowRight
                      size={15}
                      aria-hidden="true"
                      className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 7 ─ Where to buy ─────────────────────────────────── */}
      <section
        className="bg-background-subtle border-b border-border-subtle"
        style={anim(700)}
      >
        <div className="max-w-[748px] mx-auto px-5 md:px-10 py-8 md:py-12">
          <WhereToBuy lang={lang} source="quiz" />
        </div>
      </section>

      {/* ── SECTION 8 ─ Disclaimer + CTA ────────────────────────────── */}
      <section
        className="bg-background-subtle"
        style={anim(800)}
      >
        <div className="max-w-[748px] mx-auto px-5 md:px-10 py-8 md:py-12 flex flex-col gap-8">
          <Alert variant="info" lang={lang} />
          {/* Mobile: stacked full-width. Desktop: centered row */}
          <div className="flex flex-col gap-3 md:flex-row md:justify-center md:gap-4">
            <Button
              variant="primary"
              size="default"
              iconLeft={<ExternalLink size={16} aria-hidden="true" />}
              className="w-full md:w-auto"
              onClick={() => {
                track("view_products_clicked", { source: "quiz", lang })
                track("online_store_clicked", { source: "quiz", lang })
                window.open("https://beescare.rs/proizvodi/", "_blank")
              }}
            >
              {t("viewProducts")}
            </Button>
            <Button
              variant="outlined"
              size="default"
              iconLeft={<RotateCcw size={16} aria-hidden="true" />}
              className="w-full md:w-auto"
              onClick={onRestart}
            >
              {t("restart")}
            </Button>
          </div>
        </div>
      </section>

    </main>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function QuizPage() {
  const [lang, setLang]               = useState<Lang>(DEFAULT_LANG)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers]         = useState<QuizAnswers>({})
  const [isLoading, setIsLoading]     = useState(false)
  const [loadingPhaseIdx, setLoadingPhaseIdx] = useState(0)
  const [result, setResult]           = useState<QuizApiResult | null>(null)
  const [error, setError]             = useState(false)

  const question       = QUIZ_QUESTIONS[currentStep]
  const totalSteps     = QUIZ_QUESTIONS.length
  const selectedAnswer = answers[question?.id]
  const isLastStep     = currentStep === totalSteps - 1
  const canGoNext      = !!selectedAnswer

  const t = (key: keyof typeof COPY) => COPY[key][lang]

  // ── Language persistence
  useEffect(() => { setLang(getSavedLang()) }, [])

  const handleLangChange = (newLang: Lang) => {
    setLang(newLang)
    saveLang(newLang)
  }

  // ── Cycle loading phases while API is pending ──────────────────────────────
  useEffect(() => {
    if (!isLoading) { setLoadingPhaseIdx(0); return }
    const phases = LOADING_PHASES[lang]
    const interval = setInterval(() => {
      setLoadingPhaseIdx(prev => {
        if (prev >= phases.length - 1) { clearInterval(interval); return prev }
        return prev + 1
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [isLoading, lang])

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleSelect(value: string) {
    // Fire quiz_started exactly once — when the very first answer is chosen
    if (Object.keys(answers).length === 0 && !answers[question.id]) {
      track("quiz_started", { lang })
    }
    track("quiz_question_answered", {
      question_id: question.id,
      question_number: currentStep + 1,
      answer: value,
      lang,
    })
    setAnswers(prev => ({ ...prev, [question.id]: value }))
  }

  function handlePrevious() {
    if (currentStep > 0) setCurrentStep(s => s - 1)
  }

  async function handleNext() {
    if (!canGoNext) return
    if (currentStep < totalSteps - 1) { setCurrentStep(s => s + 1); return }

    track("quiz_submitted", { lang, answers })
    setIsLoading(true)
    setError(false)
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, lang }),
      })
      if (!res.ok) throw new Error("API error")
      const data: QuizApiResult = await res.json()
      setResult(data)
      track("quiz_completed", {
        lang,
        skin_type: answers.skin_type,
        primary_concern: answers.primary_concern,
        products_count: data.recommendations?.primaryProducts?.length ?? 0,
      })
    } catch {
      setError(true)
      track("quiz_error", { lang, error: "api_failed" })
    } finally {
      setIsLoading(false)
    }
  }

  function handleRestart() {
    setCurrentStep(0)
    setAnswers({})
    setResult(null)
    setError(false)
    setLoadingPhaseIdx(0)
  }

  // ── Results: full-width layout outside constrained quiz container ──────────
  if (result && !isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background-subtle">
        <Navbar lang={lang} onLangChange={handleLangChange} />
        <ResultsPage
          result={result}
          lang={lang}
          answers={answers}
          onRestart={handleRestart}
        />
        <Footer />
      </div>
    )
  }

  // ── Quiz flow ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-background-subtle">
      <Navbar lang={lang} onLangChange={handleLangChange} />

      <main className="flex-1 flex flex-col items-center px-5 md:px-10 py-16 md:py-[100px]">
        <div className="w-full max-w-[748px] flex flex-col gap-8">

          {/* Static header — Figma: eyebrow h4/secondary + H1 h1/primary */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <HelpCircle size={24} color="#c2986b" aria-hidden="true" />
              <span className="text-h4 font-sans font-medium leading-headline text-text-secondary whitespace-nowrap">
                {t("eyebrow")}
              </span>
            </div>
            <h1 className="text-h2 md:text-h1 font-sans font-medium leading-headline text-text-primary">
              {t("h1")}
            </h1>
          </div>

          {/* Figma: gold brand divider under heading */}
          <div className="border-t border-border-brand w-full" />

          {/* Loading */}
          {isLoading && (
            <div className="py-8 flex justify-start">
              <LoadingIndicator text={LOADING_PHASES[lang][loadingPhaseIdx]} />
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="flex flex-col gap-4">
              <Alert variant="error" lang={lang} />
              <Button
                variant="outlined"
                size="default"
                iconLeft={<RotateCcw size={16} aria-hidden="true" />}
                onClick={handleRestart}
              >
                {t("restart")}
              </Button>
            </div>
          )}

          {/* Quiz */}
          {!isLoading && !result && !error && (
            <>
              {/* Figma: gap-[32px] inside, pt-[24px] top */}
              <div className="flex flex-col gap-8 pt-6">

                {/* Question counter + text — Figma: label-m secondary + h4 primary */}
                <div className="flex flex-col gap-[10px]">
                  <p className="text-label-m font-sans font-medium leading-label text-text-secondary">
                    {t("question")} {currentStep + 1}/{totalSteps}
                  </p>
                  <h2 className="text-h4 font-sans font-medium leading-headline text-text-primary">
                    {lang === "sr" ? question.questionSr : question.questionEn}
                  </h2>
                  <p className="text-paragraph-s font-sans leading-paragraph text-text-muted">
                    {lang === "sr" ? question.subtitleSr : question.subtitleEn}
                  </p>
                </div>

                {/* 2×2 answer grid — Figma: flex-col gap-[20px] pt-[16px] */}
                <div className="flex flex-col gap-5 pt-4">
                  {[0, 2].map(rowStart => (
                    <div key={rowStart} className="flex flex-col md:flex-row gap-5">
                      {question.options.slice(rowStart, rowStart + 2).map(opt => (
                        <div key={opt.value} className="flex-1 min-w-0">
                          <QuizAnswerCard
                            headline={lang === "sr" ? opt.labelSr : opt.labelEn}
                            description={lang === "sr" ? opt.descSr : opt.descEn}
                            selected={selectedAnswer === opt.value}
                            onClick={() => handleSelect(opt.value)}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Figma: subtle divider above nav row */}
              <div className="border-t border-border-subtle w-full" />

              {/* Mobile: stacked (next on top via flex-col-reverse). Desktop: side-by-side */}
              <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-between">
                <Button
                  variant="outlined"
                  size="default"
                  iconLeft={<ArrowLeft size={16} aria-hidden="true" />}
                  disabled={currentStep === 0}
                  className="w-full md:w-auto"
                  onClick={handlePrevious}
                >
                  {t("previous")}
                </Button>
                <Button
                  variant="primary"
                  size="default"
                  iconRight={<ArrowRight size={16} aria-hidden="true" />}
                  disabled={!canGoNext}
                  className="w-full md:w-auto"
                  onClick={handleNext}
                >
                  {isLastStep ? t("seeResults") : t("next")}
                </Button>
              </div>
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
