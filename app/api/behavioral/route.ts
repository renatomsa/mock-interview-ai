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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: behavioralEvalPrompt(question, transcript, level, language) }],
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return NextResponse.json({ transcript, ...result })
  } catch (error) {
    console.error('Behavioral API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
