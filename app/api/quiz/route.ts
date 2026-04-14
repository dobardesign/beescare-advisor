import { getQuizRecommendations } from '@/lib/quiz-logic'
import type { QuizAnswers } from '@/lib/quiz-questions'

// ─── Retry helper ─────────────────────────────────────────────────────────────
// Retries on HTTP 529 (API overloaded) with linear back-off.
// Any other error is rethrown immediately.

async function callClaudeWithRetry(
  client: any,
  params: any,
  maxRetries = 3
): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 [/api/quiz] Claude attempt ${attempt}/${maxRetries}`)
      return await client.messages.create(params)
    } catch (error: any) {
      const is529 =
        error?.status === 529 || error?.message?.includes('overloaded')

      if (is529 && attempt < maxRetries) {
        const waitMs = attempt * 2000
        console.log(`⏳ [/api/quiz] Overloaded, waiting ${waitMs}ms…`)
        await new Promise(r => setTimeout(r, waitMs))
        continue
      }
      throw error
    }
  }
}

export async function POST(request: Request) {
  try {
    const { answers, lang } = (await request.json()) as {
      answers: QuizAnswers
      lang?: string
    }

    console.log('📨 [/api/quiz] Incoming request:', { answers, lang })

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('❌ [/api/quiz] Missing ANTHROPIC_API_KEY')
      return Response.json({ error: 'Missing API key' }, { status: 500 })
    }

    // ── Rule-based product recommendations (no AI needed here) ──────────────
    const recommendations = getQuizRecommendations(answers)

    // ── Claude writes only the warm personalized intro paragraph ────────────
    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const prompt =
      lang === 'sr'
        ? `Na osnovu ovih odgovora korisnika na skincare kvizu:
- Tip kože: ${answers.skin_type}
- Primarni problem: ${answers.primary_concern}
- Problem sa telom: ${answers.body_concern}
- Iskustvo sa rutinom: ${answers.routine_experience}
- Izlaganje suncu: ${answers.sun_exposure}
- Prioritet: ${answers.priority}

Napiši topao, personalizovan uvodni paragraf (3-4 rečenice) koji:
1. Direktno se obraća korisniku i potvrđuje njihov tip kože i problem
2. Kratko objasni zašto su baš ovi proizvodi dobri za njihovu situaciju
3. Ohrabri ih da počnu polako, od osnova

Ton: topao, prijateljski, kao da razgovaraš sa osobom.
Napiši SAMO taj paragraf, bez ikakvog uvoda ili zaključka.
Koristi ISKLJUČIVO latinično pismo.`
        : `Based on these quiz answers:
- Skin type: ${answers.skin_type}
- Primary concern: ${answers.primary_concern}
- Body concern: ${answers.body_concern}
- Routine experience: ${answers.routine_experience}
- Sun exposure: ${answers.sun_exposure}
- Priority: ${answers.priority}

Write a warm, personalized intro paragraph (3-4 sentences) that:
1. Directly addresses the user and validates their skin type and concern
2. Briefly explains why these products are right for their situation
3. Encourages them to start slowly, from the basics

Tone: warm, friendly, like talking to a friend.
Write ONLY that paragraph, no intro or conclusion.`

    let intro = ''
    try {
      const message = await callClaudeWithRetry(client, {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      })
      intro = message.content[0].type === 'text' ? message.content[0].text : ''
      console.log('✅ [/api/quiz] Intro generated:', intro)
    } catch (claudeError: any) {
      const is529 =
        claudeError?.status === 529 ||
        claudeError?.message?.includes('overloaded')

      if (is529) {
        // All retries exhausted — return rule-based results with a generic intro
        console.warn('⚠️ [/api/quiz] Claude overloaded after all retries, using fallback intro')
        return Response.json({
          intro:
            lang === 'sr'
              ? "Na osnovu tvojih odgovora, kreirali smo tvoju personalnu rutinu sa bee's care proizvodima."
              : "Based on your answers, we've created your personal routine with bee's care products.",
          recommendations,
          seasonalTip:
            lang === 'sr'
              ? recommendations.seasonalTip
              : recommendations.seasonalTipEn,
          lang,
        })
      }
      throw claudeError
    }

    return Response.json({
      intro,
      recommendations,
      seasonalTip:
        lang === 'sr'
          ? recommendations.seasonalTip
          : recommendations.seasonalTipEn,
      lang,
    })
  } catch (error) {
    console.error('💥 [/api/quiz] Route error:', error)
    console.error(
      '💥 [/api/quiz] Error details:',
      error instanceof Error ? error.message : String(error)
    )
    return Response.json(
      {
        error: 'Quiz failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
