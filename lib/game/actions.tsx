'use server'

import { BotMessage } from '@/components/stocks'

import { nanoid } from '@/lib/utils'
import { GoogleGenerativeAI, InlineDataPart } from '@google/generative-ai'

export async function submitUserDrawing(drawingBase64: string) {
  'use server'

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  })
  const prompt = `Guess the drawing. Give me just a single answer. using this JSON schema:
{ "type": "guess",
  "properties": {
    "answer": {
        "ko": "your answer string in Korean",
        "en": "your answer string in English",
    }
  }
}`
  console.log('prompt', prompt)

  const imagePart: InlineDataPart = {
    inlineData: {
      data: drawingBase64,
      mimeType: 'image/png'
    }
  }

  const result = await model.generateContent([prompt, imagePart])
  console.log(result.response.text())

  return {
    id: nanoid(),
    display: <BotMessage content={result.response.text()} />
  }
}
