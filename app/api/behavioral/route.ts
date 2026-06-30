import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { behavioralEvalPrompt } from '@/lib/prompts'
import type { Language } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audio = formData.get('audio') as File | null
    const text = formData.get('text') as string | null
    const question = formData.get('question') as string
    const language = formData.get('language') as Language

    if ((!audio && !text) || !question || !language) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // The candidate may answer by audio (transcribed by Whisper) or by typing.
    let transcript: string
    if (text != null) {
      transcript = text
    } else {
      const transcription = await openai.audio.transcriptions.create({
        file: audio!,
        model: 'whisper-1',
      })
      transcript = transcription.text
    }

    // Deterministic guard: an empty or near-empty transcript cannot earn any
    // credit, so short-circuit to a 0 score without spending a model call.
    if (transcript.trim().length < 15) {
      const emptyMsg =
        language === 'pt'
          ? 'Não foi possível identificar uma resposta. Forneça uma resposta completa para ser avaliado.'
          : 'No answer could be detected. Provide a complete response to be evaluated.'
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
      messages: [{ role: 'user', content: behavioralEvalPrompt(question, transcript, language) }],
      response_format: { type: 'json_object' },
      temperature: 0,
      seed: 7,
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return NextResponse.json({ transcript, ...result })
  } catch (error) {
    console.error('Behavioral API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
