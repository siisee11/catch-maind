'use server'

import { Participant } from '@/lib/game/store'

import { nanoid } from '@/lib/utils'
import { GoogleGenerativeAI, InlineDataPart } from '@google/generative-ai'

export type KeywordResult = {
  type: 'keyword'
  properties: {
    keyword: {
      ko: string
      en: string
    }
  }
}

export type GuessResult = {
  type: 'guess'
  properties: {
    answer: {
      ko: string
      en: string
    }
  }
}

export type MessageResult = {
  type: 'message'
  properties: {
    message: {
      ko: string
      en: string
    }
  }
}

// FIXME: why this guard not working
export const isGuessResult = (
  result: GuessResult | MessageResult
): result is GuessResult => {
  return result.type === 'guess'
}

export const isMessageResult = (
  result: GuessResult | MessageResult
): result is MessageResult => {
  return result.type === 'message'
}

export async function createKeyword(category: string): Promise<KeywordResult> {
  'use server'

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 2,
      topK: 64,
      topP: 1
    }
  })
  const prompt = `You are 'pictionary' game word generator. 
  Create one word in ${category}. 
  The keyword should be a single word and draw-able.
  Be creative!
  List 10 keywords that you can think of, and choose one of them.

  your answer should be JSON object that has type and properties. using this JSON schema:
{ "type": "keyword",
  "properties": {
    "keyword": { 
        "ko": "keyword string in Korean"
        "en": "keyword string in English"
    }
  }
}`
  console.log('prompt', prompt)
  const result = await model.generateContent([prompt])
  const res = JSON.parse(result.response.text()) as KeywordResult
  return res
}

export async function guess(
  participant: Participant,
  drawingBase64: string
): Promise<{ id: string; guessResult: GuessResult | MessageResult }> {
  'use server'

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: participant.creativity ?? 1
    }
  })
  const prompt = `Guess the given drawing. Give me just a single answer. 

If you think the drawing is too hard to guess, you can ask for a hint or give direct feedback to the drawer.
  
using this JSON schema (object including type and properties):

If you guess the answer:
{ "type": "guess",
  "properties": {
    "answer": {
        "ko": "your answer string in Korean",
        "en": "your answer string in English",
    }
  }
}
  
If you ask for a hint or give a feedback:
{ "type": "message" 
  "properties": {
    "message": {
        "ko": "your message in Korean",
        "en": "your message in English"
    }
}
`
  const imagePart: InlineDataPart = {
    inlineData: {
      data: drawingBase64,
      mimeType: 'image/png'
    }
  }

  const result = await model.generateContent([prompt, imagePart])
  const guessResult = JSON.parse(result.response.text()) as
    | GuessResult
    | MessageResult

  return {
    id: nanoid(),
    guessResult
  }
}
