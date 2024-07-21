import { createKeyword, submitUserDrawing } from '@/lib/game/actions'
import { nanoid } from 'nanoid'
import { create } from 'zustand'

const CATETORIES = [
  'Food and Drink',
  'Film',
  'Geography',
  'Sports',
  'History',
  'Famous People',
  'Netflix',
  'Animals',
  'Halloween',
  'Christmas'
]

export type Participant = {
  id: string
  name: string
  avatarUrl: string
  message?: string
}

export const GAME_STATUS = {
  NOT_STARTED: 'not-started',
  PREPARING: 'preparing',
  READY_TO_PLAY: 'ready-to-play',
  PLAYING: 'playing',
  FINISHED: 'finished'
} as const

export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS]

interface GameState {
  participants: Participant[]
  userDrawingBase64?: string
  guessingInterval?: NodeJS.Timeout

  keyword: string
  status: GameStatus

  prepare: () => void
  play: () => void
  finish: () => void

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
    keyword: '',
    status: 'not-started',
    updateDrawing: (base64: string) => {
      set({ userDrawingBase64: base64 })
    },
    prepare: async () => {
      set({ status: 'preparing' })
      const category = CATETORIES[Math.floor(Math.random() * CATETORIES.length)]
      const res = await createKeyword(category)
      set({ keyword: res.properties.keyword.ko, status: 'ready-to-play' })
      get().play()
    },
    play: async () => {
      set({ status: 'playing' })
      const existingInterval = get().guessingInterval
      if (existingInterval) {
        clearInterval(existingInterval)
      }
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
      const interval = setInterval(guess, 3000)
      set({ guessingInterval: interval })
    },
    finish: () => {
      const interval = get().guessingInterval
      if (interval) {
        clearInterval(interval)
      }
      set({ status: 'finished' })
    }
  })
  // {
  //   name: 'game-storage'
  // }
)
