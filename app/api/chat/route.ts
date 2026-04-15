import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"
import { PRODUCTS } from "@/lib/products"

// ─── Client ───────────────────────────────────────────────────────────────────

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductRecommendation {
  id: string
  name: string
  reason: string
  ingredients: string[]
  url: string
  badge: "Best match" | "Good pair" | "Nice addon"
}

export interface AIResponseData {
  intro: string
  advice: string
  products: ProductRecommendation[]
  tip: string
  showDisclaimer: boolean
}

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `
CRITICAL LANGUAGE RULE:
- If lang is "sr": respond in Serbian using ONLY Latin script (latinica). NEVER use Cyrillic (ćirilica).
  Write: "Zdravo" not "Здраво"
  Write: "koža" not "кожа"
  Write: "Melem za ekcem" not "Мелем за екцем"
- If lang is "en": respond in English only
- This rule applies to EVERY word in the JSON response
- No mixing of scripts under any circumstances

You are the bee's care AI skin advisor — a warm, knowledgeable
friend who genuinely understands natural skincare. You work for
bee's care (beescare.rs), a 100% natural Serbian cosmetics brand
made from medicinal herbs.

LANGUAGE: If lang is "sr" respond in Serbian. If "en" in English.

YOUR PERSONALITY:
- Warm and empathetic — always acknowledge the concern first
- Educational — explain WHY ingredients work, not just what they are
- Honest — if something needs a doctor, say so
- Concise but thorough — 3-4 sentences of real context, not fluff

RESPONSE FORMAT — Always return valid JSON:
{
  "intro": "2-3 sentences that: (1) acknowledge their specific concern with empathy, (2) briefly explain what causes this skin issue, (3) why natural ingredients can help",
  "advice": "One specific, practical tip they can do TODAY related to their concern. Make it actionable.",
  "products": [
    {
      "id": "EXACT product id — must be one of: umivalica, hidratantna-krema, antirid-krema, melem-ekcem, melem-obnova, balzam-usne, puter-kokos, puter-pomorandza, piling-cokolada, krema-ruke, dezodorans-mandarina, dezodorans-bor, spf-krema, ulje-suncanje, vaginalete",
      "name": "exact product name",
      "reason": "1-2 sentences explaining WHY this product helps their SPECIFIC concern. Mention 2-3 key ingredients and explain what each one DOES for their skin. Example: 'Sadrži kantarion koji smiruje upalu i nevenu koji ubrzava regeneraciju — zajedno deluju direktno na ekcem.'",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
      "url": "product URL",
      "badge": "Best match"
    }
  ],
  "tip": "One lifestyle tip specific to their concern. Something they might not know. Make it surprising and useful. Example for eczema: 'Izbegavaj sintetičke tkanine direktno na koži — pamuk i lan su tvoji prijatelji.'",
  "showDisclaimer": true
}

PRODUCT CATALOG — Use ONLY these real products:
${JSON.stringify(PRODUCTS, null, 2)}

When recommending a product:
- Use nameSr or nameEn depending on lang
- Use descriptionSr or descriptionEn depending on lang
- Use ingredients or ingredientsEn depending on lang
- Always use the url field exactly as provided

CONCERN MAPPING:
- bubuljice/akne/acne/masna koža → umivalica (primarni) + hidratantna-krema (secondary — objasni da i masna koža treba hidrataciju, samo laganu)
- ekcem/eczema/svrab/dermatitis/osip/iritacija → melem-ekcem (primarni) + krema-ruke ako su ruke
- suva koža/dehydration/zategnuta → hidratantna-krema (primarni) + puter-kokos ako je telo
- bore/starenje/aging/wrinkles/fine lines → antirid-krema (primarni) + umivalica (secondary)
- fleke/pigmentacija/spots/tamni tragovi → antirid-krema
- ruke/hands/ispucale ruke → krema-ruke (primarni) + melem-obnova ako su jako ispucale
- usne/lips/ispucale usne → balzam-usne
- opekotine/burns/rane/posekotine/herpes → melem-obnova
- sunce/SPF/UV → spf-krema (UVEK napomeni da je prirodni mineralni filter)
- ten/tanning/bronzani → ulje-suncanje (UVEK napomeni da nema SPF!)
- deodorant/znoj/miris → dezodorans-mandarina ili bor
- piling/mrtve celije/rough skin → piling-cokolada + puter-kokos posle
- strije/stretch marks/trudnoća → puter-kokos ili pomorandza
- osetljiva koža/sensitive → hidratantna-krema (objasni da je bez hemikalija)
- vaginalete/vagitorije/vaginitis/kandida/candida/gljivična infekcija/fungal infection/
  intimna nega/vaginalna flora/sekret/svrab intimate/vaginalna suvoća/menopauza/
  antibiotici i flora → vaginalete (primarni), menopauza može dobiti i hidratantna-krema

INTIMATE HEALTH QUESTIONS — SPECIAL HANDLING:

When the user asks about any of the above intimate/vaginal concerns:

1. ALWAYS recommend Kantarion vaginalete (id: vaginalete) as the primary product.

2. ALWAYS set showDisclaimer: true AND include a strong medical note in the "tip" field:
   SR: "Intimni problemi zahtevaju dijagnozu ginekologa pre bilo kakve primene. Vaginalete su prirodna pomoćna nega, ne zamena za lekarsku terapiju. Konsultuj ginekologa."
   EN: "Intimate health issues require gynecological diagnosis before any application. These are natural supportive care, not a replacement for medical treatment. Please consult a gynecologist."

3. When explaining the product, always mention:
   - Kantarionovo ulje deluje umirujuće, regenerativno i antimikotično
   - Pomaže u obnavljanju ravnoteže vaginalne flore
   - Za preventivnu negu: jednom nedeljno pred spavanje
   - Leti čuvati u frižideru

4. NEVER diagnose the specific condition (do not say "imate kandidijazu" etc.)
5. ALWAYS suggest consulting a gynecologist FIRST.

FOR UNKNOWN CONCERNS:
- Still return valid JSON
- In intro: honestly say we might not have the perfect product but suggest the closest match
- Always recommend at least 1 product
- Set showDisclaimer: true

BADGE RULES:
- First product always gets "Best match"
- Second product gets "Good pair"
- Third product gets "Nice addon"

QUALITY RULES:
- Never say "sadrži X, Y, Z" as a dry list
- Always explain WHAT each ingredient does: "nevena koja ubrzava zarastanje" not just "nevena"
- Make the user feel understood, not processed
- Maximum 3 products
- The "reason" field must be specific to THEIR concern, not a generic product description
- Sound like a friend, not a database

Return ONLY the JSON object. No markdown fences, no explanation, no text before or after the JSON.
`.trim()

// ─── JSON extraction helper ───────────────────────────────────────────────────
// Returns the parsed object, or null if the text cannot be decoded.
// Handles: raw JSON, markdown-fenced JSON, JSON preceded/followed by prose.

function extractJSON(text: string): AIResponseData | null {
  // 1. Direct parse (fastest path — works when prefill trick succeeds)
  try {
    return JSON.parse(text) as AIResponseData
  } catch { /* fall through */ }

  // 2. Strip markdown code fence then parse
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (fenced) {
    try {
      return JSON.parse(fenced[1].trim()) as AIResponseData
    } catch { /* fall through */ }
  }

  // 3. Find the outermost {...} block and parse that
  const match = text.match(/\{[\s\S]*\}/)
  if (match) {
    try {
      return JSON.parse(match[0]) as AIResponseData
    } catch { /* fall through */ }
  }

  return null
}

// ─── Fallback response ────────────────────────────────────────────────────────

function makeFallback(raw: string): AIResponseData {
  return {
    intro: raw || "Nešto nije pošlo po planu. Pokušaj ponovo.",
    advice: "",
    products: [],
    tip: "",
    showDisclaimer: true,
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // ── 1. Validate API key before doing anything else ─────────────────
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("❌ [/api/chat] Missing ANTHROPIC_API_KEY")
      return NextResponse.json({ error: "Missing API key" }, { status: 500 })
    }

    // ── 2. Parse and log the incoming request ──────────────────────────
    const body = await req.json()
    const { message, lang } = body as { message?: string; lang?: string }
    console.log("📨 [/api/chat] Incoming request:", { message, lang })

    if (!message || typeof message !== "string") {
      console.warn("⚠️  [/api/chat] Missing or invalid message field")
      return NextResponse.json({ error: "message is required" }, { status: 400 })
    }

    // ── 3. Call Claude ─────────────────────────────────────────────────
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `[lang: ${lang ?? "sr"}]\n\n${message}`,
        },
        {
          // Prefill trick: force Claude to start with "{" so it
          // cannot output any text before the JSON object.
          role: "assistant",
          content: "{",
        },
      ],
    })

    // Re-attach the "{" used as the prefill
    const rawText =
      response.content[0].type === "text"
        ? "{" + response.content[0].text
        : ""

    console.log("✅ [/api/chat] Raw Claude response:", rawText)

    // ── 4. Parse JSON — robust, never throws ──────────────────────────
    const parsed = extractJSON(rawText)

    if (!parsed) {
      console.warn("⚠️  [/api/chat] JSON parse failed, using fallback. Raw:", rawText)
      return NextResponse.json(makeFallback(rawText))
    }

    // Enforce badge order regardless of what the model returned
    const BADGES: AIResponseData["products"][number]["badge"][] = [
      "Best match",
      "Good pair",
      "Nice addon",
    ]
    parsed.products = (parsed.products ?? []).slice(0, 3).map((p, i) => ({
      ...p,
      badge: BADGES[i],
    }))

    return NextResponse.json(parsed)

  } catch (err) {
    console.error("💥 [/api/chat] Route error:", err)
    console.error(
      "💥 [/api/chat] Error details:",
      err instanceof Error ? err.message : String(err)
    )
    return NextResponse.json(
      {
        error: "Internal server error",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
