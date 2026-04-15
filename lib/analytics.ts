import posthog from "posthog-js"

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || ""

export function initAnalytics() {
  if (typeof window === "undefined") return
  if (!POSTHOG_KEY) return

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
