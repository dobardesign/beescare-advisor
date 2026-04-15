"use client"

import { useEffect } from "react"
import { initAnalytics } from "@/lib/analytics"

/**
 * Thin client boundary that initialises PostHog once on the client.
 * Kept separate so layout.tsx can remain a Server Component
 * (required for the metadata / viewport exports to work).
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAnalytics()
  }, [])

  return <>{children}</>
}
