import {
  createKeyword,
  guess,
  isGuessResult,
  isMessageResult
} from '@/lib/game/actions'
import { nanoid } from 'nanoid'
import { create } from 'zustand'

const CATETORIES = [
  'Korean Food',
  'American Food',
  'Food',
  'Drink',
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

  gameTimer?: NodeJS.Timeout
  remainingTimer?: NodeJS.Timeout
  remainingTime: number
  keyword: string
  status: GameStatus

  totalScore: number

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
          name: 'Melon Musk',
          avatarUrl: 'https://github.com/siisee11.png',
          creativity: 2,
          score: 0,
          isCorrect: false
        }
      ],
      keyword: '',
      remainingTime: 0,
      // status: 'playing',
      status: 'not-started',
      totalScore: 0,
      updateDrawing: (base64: string) => {
        set({ userDrawingBase64: base64 })
      },

      prepare: async () => {
        set({ status: 'preparing', remainingTime: 180, totalScore: 0 })
        clearGuessingIntervals()
        const category =
          CATETORIES[Math.floor(Math.random() * CATETORIES.length)]
        const res = await createKeyword(category)
        set({ keyword: res.properties.keyword.ko, status: 'ready-to-play' })
        get().play()

        // Initialize the game timer(3 minutes), after the time call finish
        const timer = setTimeout(() => {
          get().finish()
        }, 180000)
        // Start the game timer
        const interval = setInterval(() => {
          set(state => {
            return { remainingTime: state.remainingTime - 1 }
          })
        }, 1000)
        set({
          gameTimer: timer,
          remainingTimer: interval
        })
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
              set({
                totalScore: get().totalScore + 1
              })
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
        get().gameTimer && clearTimeout(get().gameTimer)
        get().remainingTimer && clearTimeout(get().remainingTimer)
        set({
          gameTimer: undefined,
          remainingTimer: undefined
        })
        clearGuessingIntervals()
        clearParticipantsMessages()

        set({ status: 'finished', remainingTime: 0 })
      }
    }
  }
  // {
  //   name: 'game-storage'
  // }
)
