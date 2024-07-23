'use client'

import { cn } from '@/lib/utils'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useEffect } from 'react'
import { Session } from '@/lib/types'
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import { Participants } from '@/components/participants'
import { GameStatus, useGameStore } from '@/lib/game/store'
import { GamePreparingScreen } from '@/components/game/game-preparing-screen'
import { GameNotStartedScreen } from '@/components/game/game-not-started'
import { DrawingScreen } from '@/components/game/game-drawing-screen'
import { GameFinishedScreen } from '@/components/game/game-finished-screen'

export interface GameProps extends React.ComponentProps<'div'> {
  id?: string
  session?: Session
}

export function Game({ id, className, session }: GameProps) {
  const gameStatus = useGameStore(state => state.status)

  const [_, setNewGameId] = useLocalStorage('newGameId', id)

  useEffect(() => {
    setNewGameId(id)
  })

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor()

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
      className="relative group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]
      bg-gradient-to-r from-[#8B6BC2] to-[#3892DA]"
      ref={scrollRef}
    >
      <div className="absolute inset-0 bg-black/75 z-0" />
      <div
        className={cn(
          'flex flex-row justify-center pb-[100px] pt-4 md:pt-10 z-10 relative',
          className
        )}
        ref={messagesRef}
      >
        {gameStatus !== 'not-started' && gameStatus !== 'finished' ? (
          <Participants />
        ) : null}
        <div className="size-full max-w-4xl px-4">
          {statusToComponent[gameStatus]}
        </div>
        <div className="size-px" ref={visibilityRef} />
      </div>
    </div>
  )
}
