import posthog from "posthog-js"

const POSTHOG_KEY =
  process.env.NEXT_PUBLIC_POSTHOG_KEY ||
  "phc_AyK57fosfZBJvLeN5H4cvLzqR9Hyt7DdPQQNkw8FH6dh"

export function initAnalytics() {
  if (typeof window === "undefined") return

  if (!POSTHOG_KEY) {
    console.warn("PostHog key missing — analytics disabled")
    return
  }

  console.log("PostHog initializing with key:", POSTHOG_KEY.slice(0, 10) + "...")

  posthog.init(POSTHOG_KEY, {
    api_host: "https://eu.i.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: false,
  })
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return
  console.log("TRACK:", event, properties)
  posthog.capture(event, properties)
}
