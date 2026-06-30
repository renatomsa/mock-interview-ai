import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { codingEvalPrompt, finalFeedbackPrompt } from '@/lib/prompts'
import type { Language, BehavioralResult, CodingQuestion, CodingAnalysis } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const session = await req.json()
    const {
      candidateName,
      language,
      behavioralResults,
      codingQuestion,
      codingAnswer,
    }: {
      candidateName: string
      language: Language
      behavioralResults: BehavioralResult[]
      codingQuestion: CodingQuestion
      codingAnswer: string
    } = session

    // Step 1: evaluate coding answer. Deterministic guard for empty answers.
    let codingAnalysis: CodingAnalysis
    if ((codingAnswer ?? '').trim().length < 15) {
      codingAnalysis = {
        scores: { understanding: 0, approach: 0, accuracy: 0, edgeCases: 0, communication: 0 },
        feedback:
          language === 'pt'
            ? 'Nenhuma explicação foi fornecida. Descreva sua abordagem, complexidade e casos extremos para ser avaliado.'
            : 'No explanation was provided. Describe your approach, complexity, and edge cases to be evaluated.',
      }
    } else {
      const codingCompletion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: codingEvalPrompt(codingQuestion, codingAnswer, language) },
        ],
        response_format: { type: 'json_object' },
        temperature: 0,
        seed: 7,
      })
      codingAnalysis = JSON.parse(codingCompletion.choices[0].message.content || '{}')
    }

    // Step 2: generate final report
    const reportCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: finalFeedbackPrompt(
            candidateName,
            language,
            behavioralResults,
            codingQuestion,
            codingAnalysis
          ),
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
      seed: 7,
    })
    const report = JSON.parse(reportCompletion.choices[0].message.content || '{}')

    return NextResponse.json({ codingAnalysis, ...report })
  } catch (error) {
    console.error('Feedback API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
