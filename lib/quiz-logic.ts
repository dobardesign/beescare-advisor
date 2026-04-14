import { PRODUCTS } from './products'
import type { QuizAnswers } from './quiz-questions'

interface QuizResult {
  morningRoutine: typeof PRODUCTS
  eveningRoutine: typeof PRODUCTS
  weeklyRoutine: typeof PRODUCTS
  primaryProducts: typeof PRODUCTS
  seasonalTip: string
  seasonalTipEn: string
}

export function getQuizRecommendations(answers: QuizAnswers): QuizResult {
  const {
    skin_type,
    primary_concern,
    body_concern,
    routine_experience,
    sun_exposure,
    priority,
  } = answers

  const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id)!

  // ─── Morning routine (always starts with cleanser) ────────────────────────
  const morningRoutine = []

  // Step 1: Always cleanse in morning
  morningRoutine.push(getProduct('umivalica'))

  // Step 2: Treat specific concern
  if (primary_concern === 'eczema') {
    morningRoutine.push(getProduct('melem-ekcem'))
  }

  // Step 3: Moisturize (everyone needs this)
  morningRoutine.push(getProduct('hidratantna-krema'))

  // Step 4: SPF if sun exposure
  if (
    sun_exposure === 'medium' ||
    sun_exposure === 'high' ||
    sun_exposure === 'seeking_spf'
  ) {
    morningRoutine.push(getProduct('spf-krema'))
  }

  // ─── Evening routine (regeneration focus) ────────────────────────────────
  const eveningRoutine = []

  // Step 1: Cleanse
  eveningRoutine.push(getProduct('umivalica'))

  // Step 2: Treatment
  if (primary_concern === 'eczema') {
    eveningRoutine.push(getProduct('melem-ekcem'))
  } else if (primary_concern === 'aging' || primary_concern === 'spots') {
    eveningRoutine.push(getProduct('antirid-krema'))
  }

  // Step 3: Moisturize
  eveningRoutine.push(getProduct('hidratantna-krema'))

  // ─── Weekly routine ───────────────────────────────────────────────────────
  const weeklyRoutine = []

  // Body care
  if (body_concern === 'dry_body' || body_concern === 'stretch_marks') {
    weeklyRoutine.push(getProduct('puter-kokos'))
    weeklyRoutine.push(getProduct('piling-cokolada'))
  }

  if (body_concern === 'hands') {
    weeklyRoutine.push(getProduct('krema-ruke'))
    weeklyRoutine.push(getProduct('melem-obnova'))
  }

  if (skin_type === 'dry' || primary_concern === 'dryness') {
    if (!weeklyRoutine.find((p) => p.id === 'piling-cokolada')) {
      weeklyRoutine.push(getProduct('piling-cokolada'))
    }
  }

  // ─── Primary products (for results page highlight) ────────────────────────
  const primaryProducts = []

  if (primary_concern === 'eczema') {
    primaryProducts.push(getProduct('melem-ekcem'))
  } else if (primary_concern === 'aging' || primary_concern === 'spots') {
    primaryProducts.push(getProduct('antirid-krema'))
    primaryProducts.push(getProduct('umivalica'))
  } else if (primary_concern === 'dryness') {
    primaryProducts.push(getProduct('hidratantna-krema'))
    primaryProducts.push(getProduct('umivalica'))
  } else {
    primaryProducts.push(getProduct('hidratantna-krema'))
    primaryProducts.push(getProduct('umivalica'))
  }

  // Add lips if needed
  if (primary_concern === 'dryness' && skin_type === 'dry') {
    primaryProducts.push(getProduct('balzam-usne'))
  }

  // Add SPF to primary if seeking
  if (sun_exposure === 'seeking_spf' || sun_exposure === 'high') {
    if (!primaryProducts.find((p) => p.id === 'spf-krema')) {
      primaryProducts.push(getProduct('spf-krema'))
    }
  }

  // ─── Seasonal tip ─────────────────────────────────────────────────────────
  const month = new Date().getMonth()
  const isSummer = month >= 5 && month <= 8
  const isWinter = month <= 1 || month >= 11
  const isSpring = month >= 2 && month <= 4

  let seasonalTip = ''
  let seasonalTipEn = ''

  if (isSummer) {
    seasonalTip =
      'Leto savet: SPF je obavezan svaki dan, čak i oblačno. Nanosi ulje za sunčanje uvek posle kreme sa faktorom — nikad direktno na kožu.'
    seasonalTipEn =
      'Summer tip: SPF is mandatory every day, even when cloudy. Apply tanning oil always after sunscreen — never directly on skin.'
  } else if (isWinter) {
    seasonalTip =
      'Zimski savet: Hladan vazduh i grejanje isušuju kožu. Dodaj Puter za telo posle tuša i Melem za obnovu za ispucale pete i ruke.'
    seasonalTipEn =
      'Winter tip: Cold air and heating dry out skin. Add Body Butter after showering and Renewal Balm for cracked heels and hands.'
  } else if (isSpring) {
    seasonalTip =
      'Prolećni savet: Postepeno uvedi SPF u jutarnju rutinu kako dani postaju duži. Piling 1x nedeljno osvežava kožu posle zime.'
    seasonalTipEn =
      'Spring tip: Gradually introduce SPF into your morning routine as days get longer. Scrub 1x weekly refreshes skin after winter.'
  } else {
    seasonalTip =
      'Jesenji savet: Vrati intenzivnu hidrataciju — Puter za telo i Hidratantna krema pomažu koži da se pripremi za zimu.'
    seasonalTipEn =
      'Autumn tip: Bring back intensive hydration — Body Butter and Moisturizing Cream help skin prepare for winter.'
  }

  // Suppress unused-variable warnings for params that influence future logic
  void routine_experience
  void priority

  return {
    morningRoutine,
    eveningRoutine,
    weeklyRoutine,
    primaryProducts,
    seasonalTip,
    seasonalTipEn,
  }
}
