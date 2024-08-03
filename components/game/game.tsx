'use client'

import { cn } from '@/lib/utils'
import { Session } from '@/lib/types'
import { Participants } from '@/components/participants'
import { GameStatus, useGameStore } from '@/lib/game/store'
import { GamePreparingScreen } from '@/components/game/game-preparing-screen'
import { GameNotStartedScreen } from '@/components/game/game-not-started'
import { DrawingScreen } from '@/components/game/game-drawing-screen'
import { GameFinishedScreen } from '@/components/game/game-finished-screen'

export interface GameProps extends React.ComponentProps<'div'> {
  session?: Session
}

export function Game({ className }: GameProps) {
  const gameStatus = useGameStore(state => state.status)

  const statusToComponent: Record<GameStatus, React.ReactElement> = {
    'not-started': <GameNotStartedScreen />,
    preparing: <GamePreparingScreen />,
    'ready-to-play': <GamePreparingScreen />,
    playing: <DrawingScreen />,
    'preparing-next': <GamePreparingScreen />,
    finished: <GameFinishedScreen />
  }

  return (
    <div
      className="relative group w-full 
      bg-gradient-to-r from-[#8B6BC2] to-[#3892DA]"
    >
      <div className="absolute inset-0 bg-black/75 z-0" />
      <div
        className={cn(
          'flex flex-row size-full justify-center p-2 md:p-10 z-10 relative',
          className
        )}
      >
        {gameStatus !== 'not-started' && gameStatus !== 'finished' ? (
          <Participants />
        ) : null}
        {statusToComponent[gameStatus]}
      </div>
    </div>
  )
}
