import {
  createKeyword,
  guess,
  isGuessResult,
  isMessageResult
} from '@/lib/game/actions'
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
  description?: string
  creativity: number /// higher -> more creative (0-2)
  score: number

  isCorrect: boolean

  intervalId?: NodeJS.Timeout
}

export const GAME_STATUS = {
  NOT_STARTED: 'not-started',
  PREPARING: 'preparing',
  READY_TO_PLAY: 'ready-to-play',
  PLAYING: 'playing',
  PREPARING_NEXT: 'preparing-next',
  FINISHED: 'finished'
} as const

export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS]

interface GameState {
  participants: Participant[]
  userDrawingBase64?: string
  guessingIntervals?: NodeJS.Timeout[]

  keyword: string
  status: GameStatus

  prepare: () => void
  play: () => void
  prepareNext: () => void
  finish: () => void

  updateDrawing: (base64: string) => void
}

export const useGameStore = create<GameState>()(
  (set, get) => {
    const updateParticipant = (
      participantId: string,
      message: string,
      isCorrect: boolean
    ) =>
      set(state => {
        const participants = [...state.participants]
        participants.forEach(p => {
          if (p.id === participantId) {
            p.message = message
            if (isCorrect) {
              p.isCorrect = isCorrect
              p.score = p.score + 1
            }
          }
        })
        return { participants }
      })

    const clearGuessingIntervals = () => {
      const intervals = get().guessingIntervals
      if (intervals?.length ?? 0 > 0) {
        intervals?.forEach(clearInterval)
      }
    }

    const clearParticipantsMessages = () =>
      set(state => {
        const participants = [...state.participants]
        participants.forEach(p => {
          p.message = undefined
        })
        return { participants }
      })

    return {
      participants: [
        {
          id: nanoid(),
          name: 'Tonald Drump',
          avatarUrl:
            'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80',
          creativity: 0,
          score: 0,
          isCorrect: false
        },
        {
          id: nanoid(),
          name: 'Melon Musk',
          avatarUrl: 'https://github.com/shadcn.png',
          creativity: 2,
          score: 0,
          isCorrect: false
        }
      ],
      keyword: '',
      status: 'not-started',
      updateDrawing: (base64: string) => {
        set({ userDrawingBase64: base64 })
      },

      prepare: async () => {
        set({ status: 'preparing' })
        clearGuessingIntervals()
        const category =
          CATETORIES[Math.floor(Math.random() * CATETORIES.length)]
        const res = await createKeyword(category)
        set({ keyword: res.properties.keyword.ko, status: 'ready-to-play' })
        get().play()
      },
      play: async () => {
        set({ status: 'playing' })
        clearParticipantsMessages()

        // Function to handle the guessing logic for a participant
        const guessForParticipant = async (participant: Participant) => {
          const base64 = get().userDrawingBase64
          if (!base64) return
          const { guessResult } = await guess(participant, base64)
          if (get().status !== 'playing') return
          if (isGuessResult(guessResult) && guessResult.type === 'guess') {
            const answer = guessResult.properties.answer.ko
            const isAnswerCorrect = answer === get().keyword
            updateParticipant(participant.id, answer, isAnswerCorrect)
            if (isAnswerCorrect) {
              get().prepareNext()
            }
          }

          if (isMessageResult(guessResult) && guessResult.type === 'message') {
            const message = guessResult.properties.message.ko
            updateParticipant(participant.id, message, false)
          }
        }

        //   Schedule each participant's guessing with a random backoff time
        const participants = get().participants
        participants.forEach(participant => {
          const randomBackoff = Math.floor(Math.random() * 10000) + 5000
          const interval = setInterval(
            () => guessForParticipant(participant),
            randomBackoff
          )
          // Save the interval id for later clearing if needed
          participant.intervalId = interval
        })

        // Save all intervals in state for later clearing if needed
        set({
          guessingIntervals: participants
            .map(p => p.intervalId)
            .filter((e): e is Exclude<typeof e, undefined> => e !== undefined)
        })
      },
      prepareNext: async () => {
        set({ status: 'preparing-next' })
        clearGuessingIntervals()
        const category =
          CATETORIES[Math.floor(Math.random() * CATETORIES.length)]
        const res = await createKeyword(category)
        setTimeout(() => {
          set({ keyword: res.properties.keyword.ko, status: 'ready-to-play' })
          set(state => {
            const participants = [...state.participants]
            participants.forEach(p => {
              p.isCorrect = false
            })
            return { participants }
          })

          get().play()
        }, 2000)
      },
      finish: () => {
        clearGuessingIntervals()
        clearParticipantsMessages()

        set({ status: 'finished' })
      }
    }
  }
  // {
  //   name: 'game-storage'
  // }
)
