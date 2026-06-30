import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { codingEvalPrompt } from '@/lib/prompts'
import type { CodingAnalysis, CodingQuestion, Language } from '@/types'

// Evaluates a single coding explanation and returns only the CodingAnalysis.
// Used by Training mode to give immediate per-question feedback.
export async function POST(req: NextRequest) {
  try {
    const {
      question,
      answer,
      language,
    }: {
      question: CodingQuestion
      answer: string
      language: Language
    } = await req.json()

    if (!question || !language) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Deterministic guard: empty answers score 0 without a model call.
    if ((answer ?? '').trim().length < 15) {
      const analysis: CodingAnalysis = {
        scores: { understanding: 0, approach: 0, accuracy: 0, edgeCases: 0, communication: 0 },
        feedback:
          language === 'pt'
            ? 'Nenhuma explicação foi fornecida. Descreva sua abordagem, complexidade e casos extremos para ser avaliado.'
            : 'No explanation was provided. Describe your approach, complexity, and edge cases to be evaluated.',
      }
      return NextResponse.json(analysis)
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: codingEvalPrompt(question, answer, language) }],
      response_format: { type: 'json_object' },
      temperature: 0,
    })

    const analysis: CodingAnalysis = JSON.parse(completion.choices[0].message.content || '{}')
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Coding API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
