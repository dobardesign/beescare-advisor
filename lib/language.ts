export type Lang = "sr" | "en"

export const DEFAULT_LANG: Lang = "sr"

export function getSavedLang(): Lang {
  if (typeof window === "undefined") return DEFAULT_LANG
  const saved = localStorage.getItem("beescare-lang")
  if (saved === "sr" || saved === "en") return saved
  return DEFAULT_LANG
}

export function saveLang(lang: Lang): void {
  if (typeof window === "undefined") return
  localStorage.setItem("beescare-lang", lang)
}
