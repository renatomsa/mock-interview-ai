import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { codingEvalPrompt, finalFeedbackPrompt } from '@/lib/prompts'
import type { Level, Language, BehavioralResult, CodingQuestion, CodingAnalysis } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const session = await req.json()
    const {
      candidateName,
      level,
      language,
      behavioralResults,
      codingQuestion,
      codingAnswer,
    }: {
      candidateName: string
      level: Level
      language: Language
      behavioralResults: BehavioralResult[]
      codingQuestion: CodingQuestion
      codingAnswer: string
    } = session

    // Step 1: evaluate coding answer
    const codingCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'user', content: codingEvalPrompt(codingQuestion, codingAnswer, level, language) },
      ],
      response_format: { type: 'json_object' },
    })
    const codingAnalysis: CodingAnalysis = JSON.parse(
      codingCompletion.choices[0].message.content || '{}'
    )

    // Step 2: generate final report
    const reportCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: finalFeedbackPrompt(
            candidateName,
            level,
            language,
            behavioralResults,
            codingQuestion,
            codingAnalysis
          ),
        },
      ],
      response_format: { type: 'json_object' },
    })
    const report = JSON.parse(reportCompletion.choices[0].message.content || '{}')

    return NextResponse.json({ codingAnalysis, ...report })
  } catch (error) {
    console.error('Feedback API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
