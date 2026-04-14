"use client"

/**
 * Input.stories.tsx
 *
 * Visual showcase of every Input state, size, and interaction.
 * Rendered at /test below the Button stories.
 *
 * Because Input is a "use client" component, this showcase is also client-side.
 */

import { useState } from "react"
import { Input } from "./Input"

// ─── Helper wrappers ─────────────────────────────────────────────────────────

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

function Label({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-label-s font-sans leading-label text-text-muted">{caption}</span>
      {children}
    </div>
  )
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export function InputShowcase() {
  const [lastSent, setLastSent] = useState<string | null>(null)

  return (
    <div className="bg-background-subtle py-16 px-10 border-t border-border-subtle">
      <div className="max-w-[900px] mx-auto flex flex-col gap-16">

        {/* Header */}
        <div className="flex flex-col gap-2">
          <p className="text-label-m font-sans font-medium text-text-muted leading-label uppercase tracking-widest">
            Component
          </p>
          <h1 className="text-h1 font-sans font-medium text-text-primary leading-headline">
            Input
          </h1>
          <p className="text-paragraph-m font-sans text-text-secondary leading-paragraph mt-1">
            Multiline textarea · embedded send button · character counter · four states · two sizes
          </p>
        </div>

        {/* ── States ── */}
        <Section title="States — default size (162px)">

          <Label caption="Default — empty (shows placeholder)">
            <Input
              size="default"
              onSend={(v) => setLastSent(v)}
            />
          </Label>

          {/*
            "Filled" state is shown by the live component above once user types.
            The pre-filled variant below demonstrates what filled looks like
            statically by rendering a disabled input with a note.
          */}
          <Label caption="Focused — click inside to see gold border + shadow">
            {/* Same component; user must click to trigger :focus-within */}
            <Input
              size="default"
              placeholder="Click here to see focused state…"
              onSend={(v) => setLastSent(v)}
            />
          </Label>

          <Label caption="Disabled">
            <Input
              size="default"
              disabled
            />
          </Label>

        </Section>

        {/* ── Sizes ── */}
        <Section title="Sizes">

          <Label caption="default — 162px (Figma: InputBox / Default)">
            <Input
              size="default"
              onSend={(v) => setLastSent(v)}
            />
          </Label>

          <Label caption="sm — 106px (Figma: InputBox / Small)">
            <Input
              size="sm"
              onSend={(v) => setLastSent(v)}
            />
          </Label>

        </Section>

        {/* ── Send interaction ── */}
        <Section title="Send interaction">
          <p className="text-paragraph-s font-sans text-text-secondary leading-paragraph -mt-2">
            Type something → character counter appears bottom-left, send button turns gold.<br />
            Click the arrow or press <kbd className="text-label-s font-sans bg-background-default border border-border-subtle rounded px-1.5 py-0.5">⌘ Enter</kbd> to send.
          </p>

          <Input
            size="default"
            onSend={(v) => setLastSent(v)}
          />

          {lastSent !== null && (
            <div className="flex gap-3 items-start p-4 bg-feedback-success-100 border border-feedback-success-300 rounded-alert">
              <span className="text-label-s font-sans leading-label text-text-primary">
                Sent: <span className="font-medium">"{lastSent}"</span>
              </span>
            </div>
          )}
        </Section>

        {/* ── Max length ── */}
        <Section title="Character limit — 100 chars">
          <Label caption="maxChars={100} — counter turns red at limit">
            <Input
              size="default"
              maxChars={100}
              placeholder="Only 100 characters allowed…"
              onSend={(v) => setLastSent(v)}
            />
          </Label>
        </Section>

        {/* ── On white background (card context) ── */}
        <section className="flex flex-col gap-6">
          <h2 className="text-h4 font-sans font-medium text-text-primary border-b border-border-subtle pb-3">
            Context — on white background
          </h2>
          <div className="bg-background-default rounded-card p-8 flex flex-col gap-6">
            <Input
              size="default"
              onSend={(v) => setLastSent(v)}
            />
            <Input
              size="sm"
              onSend={(v) => setLastSent(v)}
            />
          </div>
        </section>

      </div>
    </div>
  )
}
