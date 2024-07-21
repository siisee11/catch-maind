import { submitUserDrawing } from '@/lib/game/actions'
import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Participant = {
  id: string
  name: string
  avatarUrl: string
  message?: string
}

interface GameState {
  participants: Participant[]
  userDrawingBase64?: string
  guessingInterval?: NodeJS.Timeout
  play: () => void
  updateDrawing: (base64: string) => void
}

export const useGameStore = create<GameState>()(
  (set, get) => ({
    participants: [
      {
        id: nanoid(),
        name: 'Tonald Drump',
        avatarUrl: 'https://github.com/shadcn.png'
      },
      {
        id: nanoid(),
        name: 'Melon Musk',
        avatarUrl: 'https://github.com/shadcn.png'
      }
    ],
    updateDrawing: (base64: string) => {
      set({ userDrawingBase64: base64 })
    },
    play: async () => {
      const guess = async () => {
        const base64 = get().userDrawingBase64
        if (!base64) return
        const res = await submitUserDrawing(base64)
        set(state => {
          const participants = [...state.participants]
          const guesser =
            participants[Math.floor(Math.random() * participants.length)]
          participants.forEach(participant => {
            if (participant === guesser) {
              participant.message = res.guessResult.properties.answer.ko
            }
          })
          return { participants }
        })
      }
      const interval = setInterval(guess, 10000)
      set({ guessingInterval: interval })
    }
  })
  // {
  //   name: 'game-storage'
  // }
)
