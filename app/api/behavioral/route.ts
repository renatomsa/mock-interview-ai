import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { behavioralEvalPrompt } from '@/lib/prompts'
import type { Language, Level } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audio = formData.get('audio') as File
    const question = formData.get('question') as string
    const level = formData.get('level') as Level
    const language = formData.get('language') as Language

    if (!audio || !question || !level || !language) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: 'whisper-1',
    })

    const transcript = transcription.text

    // Deterministic guard: an empty or near-empty transcript cannot earn any
    // credit, so short-circuit to a 0 score without spending a model call.
    if (transcript.trim().length < 15) {
      const emptyMsg =
        language === 'pt'
          ? 'Não foi possível identificar uma resposta. Grave uma resposta completa para ser avaliado.'
          : 'No answer could be detected. Record a complete response to be evaluated.'
      return NextResponse.json({
        transcript,
        scores: { starStructure: 0, clarity: 0, relevance: 0 },
        strengths: [],
        improvements: [
          language === 'pt'
            ? 'Forneça uma resposta completa usando a estrutura STAR.'
            : 'Provide a complete answer using the STAR structure.',
        ],
        feedback: emptyMsg,
      })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: behavioralEvalPrompt(question, transcript, level, language) }],
      response_format: { type: 'json_object' },
      temperature: 0,
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return NextResponse.json({ transcript, ...result })
  } catch (error) {
    console.error('Behavioral API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
