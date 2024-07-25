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

export async function createKeyword(
  category: string,
  usedWords: string[]
): Promise<KeywordResult> {
  'use server'

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const systemInstruction = `You are creative 'pictionary' game word generator.
  The game word should be a single word and draw-able.
  Be creative! Don't be so predictable like 'soccer' or 'mountain'.
  You receive a category and generate a game word in that category.
  You receive used words and avoid using them.
  Your response must be a JSON object containing type and properties.
  Use this JSON schema:
{ 
  "type": "keyword",
  "properties": {
    "keyword": { 
        "ko": "keyword string in Korean"
        "en": "keyword string in English"
    }
  }
}
  
  `
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 2,
      topK: 64,
      topP: 1
    }
  })
  const prompt = `category: ${category}. used words: ${usedWords.join(', ')}`
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
