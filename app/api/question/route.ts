import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { codingQuestionPrompt } from '@/lib/prompts'
import type { Language, Level } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { level, language, usedTopics = [] } = await req.json()

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: codingQuestionPrompt(level as Level, language as Language, usedTopics) },
      ],
      response_format: { type: 'json_object' },
    })

    const question = JSON.parse(completion.choices[0].message.content || '{}')
    return NextResponse.json(question)
  } catch (error) {
    console.error('Question API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
