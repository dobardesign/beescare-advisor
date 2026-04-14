/**
 * Button.stories.tsx
 *
 * Visual showcase of every Button variant, size, state, and icon combination.
 * Rendered at /test via app/test/page.tsx.
 */

import { Button } from "./Button"

// ─── Demo icons ───────────────────────────────────────────────────────────────

/** Question-mark circle — mirrors Figma Icon/Filled/Question */
function IconQuestion() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15" />
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <text
        x="10"
        y="14.5"
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill="currentColor"
        fontFamily="sans-serif"
      >
        ?
      </text>
    </svg>
  )
}

/** Arrow right — mirrors Figma Icon/Outline/ArrowRight */
function IconArrowRight() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  )
}

/** Arrow left — mirrors Figma Icon/Outline/ArrowLeft */
function IconArrowLeft() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
      <path d="M16 10H4M9 5L4 10l5 5" />
    </svg>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-h4 font-sans font-medium text-text-primary border-b border-border-subtle pb-3">
        {title}
      </h2>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </section>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
    </div>
  )
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-label-s font-sans text-text-muted leading-label text-center">
      {children}
    </span>
  )
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export function ButtonStories() {
  return (
    <div className="min-h-screen bg-background-subtle py-16 px-10">
      <div className="max-w-[900px] mx-auto flex flex-col gap-16">

        {/* Header */}
        <div className="flex flex-col gap-2">
          <p className="text-label-m font-sans font-medium text-text-muted leading-label uppercase tracking-widest">
            Component
          </p>
          <h1 className="text-h1 font-sans font-medium text-text-primary leading-headline">
            Button
          </h1>
          <p className="text-paragraph-m font-sans text-text-secondary leading-paragraph mt-1">
            Two variants · five interactive states · icon support · two sizes
          </p>
        </div>

        {/* ── Primary variant ── */}
        <Section title="Primary — all states">
          <Label>
            <Button variant="primary">Primary button</Button>
            <Caption>Regular</Caption>
          </Label>
          <Label>
            {/* Hover — simulated with inline style since CSS hover requires mouse */}
            <Button
              variant="primary"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0,0,0,0.05),rgba(0,0,0,0.05))",
              }}
            >
              Primary button
            </Button>
            <Caption>Hover</Caption>
          </Label>
          <Label>
            <Button
              variant="primary"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.2))",
              }}
            >
              Primary button
            </Button>
            <Caption>Pressed</Caption>
          </Label>
          <Label>
            {/* Focused — simulated with ring override */}
            <Button
              variant="primary"
              className="ring-2 ring-border-focus ring-offset-0"
            >
              Primary button
            </Button>
            <Caption>Focused</Caption>
          </Label>
          <Label>
            <Button variant="primary" disabled>
              Primary button
            </Button>
            <Caption>Disabled</Caption>
          </Label>
        </Section>

        {/* ── Outlined variant ── */}
        <Section title="Outlined — all states">
          <Label>
            <Button variant="outlined">Outlined button</Button>
            <Caption>Regular</Caption>
          </Label>
          <Label>
            <Button variant="outlined" className="bg-interaction-hover">
              Outlined button
            </Button>
            <Caption>Hover</Caption>
          </Label>
          <Label>
            <Button variant="outlined" className="bg-interaction-pressed">
              Outlined button
            </Button>
            <Caption>Pressed</Caption>
          </Label>
          <Label>
            <Button
              variant="outlined"
              className="border-interaction-focus-ring"
            >
              Outlined button
            </Button>
            <Caption>Focused</Caption>
          </Label>
          <Label>
            <Button variant="outlined" disabled>
              Outlined button
            </Button>
            <Caption>Disabled</Caption>
          </Label>
        </Section>

        {/* ── Icon variants ── */}
        <Section title="Icon — left · right · none">
          <Label>
            <Button variant="primary" iconLeft={<IconQuestion />}>
              Primary button
            </Button>
            <Caption>Primary / Icon Left</Caption>
          </Label>
          <Label>
            <Button variant="primary" iconRight={<IconArrowRight />}>
              Primary button
            </Button>
            <Caption>Primary / Icon Right</Caption>
          </Label>
          <Label>
            <Button variant="primary" disabled iconLeft={<IconQuestion />}>
              Primary button
            </Button>
            <Caption>Primary / Icon Left / Disabled</Caption>
          </Label>
          <Label>
            <Button variant="outlined" iconLeft={<IconQuestion />}>
              Outlined button
            </Button>
            <Caption>Outlined / Icon Left</Caption>
          </Label>
          <Label>
            <Button variant="outlined" iconRight={<IconArrowRight />}>
              Outlined button
            </Button>
            <Caption>Outlined / Icon Right</Caption>
          </Label>
          <Label>
            <Button variant="outlined" disabled iconRight={<IconArrowRight />}>
              Outlined button
            </Button>
            <Caption>Outlined / Icon Right / Disabled</Caption>
          </Label>
        </Section>

        {/* ── Real usage from screens ── */}
        <Section title="Real usage — from Figma screens">
          <Label>
            <Button variant="outlined" iconLeft={<IconQuestion />}>
              Skincare routine quizz
            </Button>
            <Caption>Homepage — Quiz chip</Caption>
          </Label>
          <Label>
            <Button variant="primary" disabled iconLeft={<IconArrowLeft />}>
              Previous question
            </Button>
            <Caption>Quiz page 1 — Back (disabled)</Caption>
          </Label>
          <Label>
            <Button variant="primary" iconRight={<IconArrowRight />}>
              Next question
            </Button>
            <Caption>Quiz page 1 — Next</Caption>
          </Label>
          <Label>
            <Button variant="outlined" iconLeft={<IconArrowLeft />}>
              Previous question
            </Button>
            <Caption>Quiz page 2 — Back</Caption>
          </Label>
          <Label>
            <Button variant="primary" iconRight={<IconArrowRight />}>
              Next question
            </Button>
            <Caption>Quiz page 2 — Next</Caption>
          </Label>
          <Label>
            <Button variant="primary">Learn more</Button>
            <Caption>Results — Product card</Caption>
          </Label>
        </Section>

        {/* ── Sizes ── */}
        <Section title="Sizes — default · sm">
          <Label>
            <Button variant="primary" size="default">
              Default (44px)
            </Button>
            <Caption>default</Caption>
          </Label>
          <Label>
            <Button variant="primary" size="sm">
              Small (36px)
            </Button>
            <Caption>sm</Caption>
          </Label>
          <Label>
            <Button variant="outlined" size="default">
              Default (44px)
            </Button>
            <Caption>default</Caption>
          </Label>
          <Label>
            <Button variant="outlined" size="sm">
              Small (36px)
            </Button>
            <Caption>sm</Caption>
          </Label>
          <Label>
            <Button variant="outlined" size="sm" iconLeft={<IconQuestion />}>
              Quiz chip sm
            </Button>
            <Caption>sm with icon</Caption>
          </Label>
        </Section>

        {/* ── On dark background (footer context) ── */}
        <section className="flex flex-col gap-6">
          <h2 className="text-h4 font-sans font-medium text-text-primary border-b border-border-subtle pb-3">
            Context — on dark background
          </h2>
          <div className="bg-background-inverse rounded-card p-8 flex flex-wrap gap-4 items-center">
            <Button variant="primary">Primary button</Button>
            <Button variant="outlined">Outlined button</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <Button variant="outlined" disabled>
              Disabled
            </Button>
          </div>
        </section>

      </div>
    </div>
  )
}
