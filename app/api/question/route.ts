import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { codingQuestionPrompt } from '@/lib/prompts'
import { getRandomCoding } from '@/lib/codingBank'
import type { Language, Level } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const {
      level,
      language,
      usedTopics = [],
      usedIds = [],
      topic,
    } = await req.json()

    // Prefer a curated, level-calibrated question from the bank.
    const fromBank = getRandomCoding(level as Level, language as Language, usedIds, topic)
    if (fromBank) {
      return NextResponse.json({ id: fromBank.id, ...fromBank.question })
    }

    // Fallback: generate on the fly (e.g. a requested topic not in the bank).
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: codingQuestionPrompt(level as Level, language as Language, usedTopics) },
      ],
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
