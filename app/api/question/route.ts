import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { codingQuestionPrompt } from '@/lib/prompts'
import { getRandomCoding } from '@/lib/codingBank'
import type { Language } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { language, usedIds = [], topic } = await req.json()

    // Serve a random, curated question from the bank (random difficulty — the
    // user does not choose it in Simulation).
    const fromBank = getRandomCoding(language as Language, usedIds, topic)
    if (fromBank) {
      return NextResponse.json({ id: fromBank.id, ...fromBank.question })
    }

    // Fallback: generate on the fly (only if the bank has nothing matching).
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: codingQuestionPrompt(language as Language) }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const question = JSON.parse(completion.choices[0].message.content || '{}')
    return NextResponse.json(question)
  } catch (error) {
    console.error('Question API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
