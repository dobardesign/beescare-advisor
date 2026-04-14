"use client"

import { ButtonStories } from "@/components/ui/Button.stories"
import { InputShowcase } from "@/components/ui/Input.stories"
import { Alert } from "@/components/ui/Alert"
import { LoadingIndicator } from "@/components/ui/LoadingIndicator"
import { QuestionCard } from "@/components/ui/QuestionCard"
import { ProductCard } from "@/components/ui/ProductCard"
import { QuizAnswerCardShowcase } from "./QuizAnswerCardShowcase"
import { LanguagePickerShowcase } from "./LanguagePickerShowcase"

// ─── Shared layout helpers ────────────────────────────────────────────────────

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background-subtle py-16 px-10 border-t border-border-subtle">
      <div className="max-w-[900px] mx-auto flex flex-col gap-16">
        {children}
      </div>
    </div>
  )
}

function PageHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-label-m font-sans font-medium text-text-muted leading-label uppercase tracking-widest">
        Component
      </p>
      <h1 className="text-h1 font-sans font-medium text-text-primary leading-headline">
        {title}
      </h1>
      <p className="text-paragraph-m font-sans text-text-secondary leading-paragraph mt-1">
        {sub}
      </p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-h4 font-sans font-medium text-text-primary border-b border-border-subtle pb-3">
        {title}
      </h2>
      {children}
    </section>
  )
}

// ─── Alert showcase ───────────────────────────────────────────────────────────

function AlertShowcase() {
  return (
    <Page>
      <PageHeader title="Alert" sub="4 variants · bilingual copy (SR / EN) · optional custom message" />
      <Section title="English (lang=&quot;en&quot;)">
        <div className="flex flex-col gap-3">
          <Alert variant="info"    lang="en" />
          <Alert variant="error"   lang="en" />
          <Alert variant="warning" lang="en" />
          <Alert variant="success" lang="en" />
        </div>
      </Section>
      <Section title="Serbian (lang=&quot;sr&quot;)">
        <div className="flex flex-col gap-3">
          <Alert variant="info"    lang="sr" />
          <Alert variant="error"   lang="sr" />
          <Alert variant="warning" lang="sr" />
          <Alert variant="success" lang="sr" />
        </div>
      </Section>
      <Section title="Custom message prop">
        <div className="flex flex-col gap-3">
          <Alert variant="info"    message="This is a custom override message passed via the message prop." />
          <Alert variant="error"   message="Custom error — skin type not detected. Please retake the quiz." />
          <Alert variant="success" message="Custom success — your product has been added to the routine." />
        </div>
      </Section>
    </Page>
  )
}

// ─── LoadingIndicator showcase ────────────────────────────────────────────────

function LoadingShowcase() {
  return (
    <Page>
      <PageHeader title="LoadingIndicator" sub="Spinning leaf ring · bilingual label · configurable text" />
      <Section title="Default">
        <LoadingIndicator />
      </Section>
      <Section title="Custom text">
        <div className="flex flex-col gap-6">
          <LoadingIndicator text="Analyzing your skin concern..." />
          <LoadingIndicator text="Building your routine..." />
          <LoadingIndicator text="Fetching recommendations..." />
        </div>
      </Section>
      <Section title="On white card">
        <div className="bg-background-default rounded-card p-8">
          <LoadingIndicator />
        </div>
      </Section>
    </Page>
  )
}

// ─── QuestionCard showcase ────────────────────────────────────────────────────

function QuestionCardShowcase() {
  return (
    <Page>
      <PageHeader title="QuestionCard" sub="487px wide · edit action · Results page context" />
      <Section title="Default">
        <QuestionCard
          question="I have dry, sensitive skin and I've been struggling with redness around my nose and cheeks. I'm looking for a simple morning routine that won't irritate my skin."
          onEdit={() => {}}
        />
      </Section>
      <Section title="Short question">
        <QuestionCard
          question="What should I use for dark circles?"
          onEdit={() => {}}
        />
      </Section>
      <Section title="Right-aligned on Results page (left margin 261px)">
        <div className="flex justify-end bg-background-default rounded-card p-8">
          <QuestionCard
            question="I have dry, sensitive skin and I've been struggling with redness around my nose and cheeks. I'm looking for a simple morning routine that won't irritate my skin."
            onEdit={() => {}}
          />
        </div>
      </Section>
    </Page>
  )
}

// ─── ProductCard showcase ─────────────────────────────────────────────────────

function ProductCardShowcase() {
  return (
    <Page>
      <PageHeader
        title="ProductCard"
        sub="3 badge variants · image left / right · highlights list · Learn more CTA"
      />
      <Section title="Best match (image left)">
        <ProductCard
          badge="best-match"
          image=""
          name="Hydrating Barrier Serum"
          description="A lightweight, fragrance-free serum that restores the skin's moisture barrier and calms redness."
          highlights={[
            "Ceramide-rich formula",
            "Fragrance & alcohol free",
            "Clinically tested for sensitive skin",
          ]}
          href="#"
        />
      </Section>
      <Section title="Good pair (image right — reverse=true)">
        <ProductCard
          badge="good-pair"
          image=""
          name="Gentle Foaming Cleanser"
          description="A pH-balanced, soap-free cleanser that removes impurities without stripping natural oils."
          highlights={[
            "pH 5.5 balanced",
            "Suitable for morning & evening",
          ]}
          href="#"
          reverse
        />
      </Section>
      <Section title="Nice addon (image left)">
        <ProductCard
          badge="nice-addon"
          image=""
          name="SPF 50 Daily Moisturiser"
          description="Broad-spectrum sun protection in a non-greasy, mattifying finish. Perfect as the last step of any routine."
          highlights={[
            "SPF 50 / PA++++",
            "No white cast",
            "Mattifying finish",
          ]}
          href="#"
        />
      </Section>
    </Page>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TestPage() {
  return (
    <>
      <ButtonStories />
      <InputShowcase />
      <AlertShowcase />
      <LoadingShowcase />
      <QuestionCardShowcase />
      {/* Client components rendered via thin wrappers */}
      <QuizAnswerCardShowcase />
      <LanguagePickerShowcase />
      <ProductCardShowcase />
    </>
  )
}
