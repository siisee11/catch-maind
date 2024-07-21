'use client'

import { cn } from '@/lib/utils'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useEffect, useState } from 'react'
import { Message, Session } from '@/lib/types'
import { usePathname, useRouter } from 'next/navigation'
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import { DrawingScreen } from '@/components/drawing-screen'
import { Participants } from '@/components/participants'

export interface GameProps extends React.ComponentProps<'div'> {
  id?: string
  session?: Session
}

export function Game({ id, className, session }: GameProps) {
  const router = useRouter()
  const path = usePathname()

  const [_, setNewGameId] = useLocalStorage('newGameId', id)

  useEffect(() => {
    setNewGameId(id)
  })

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor()

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div
        className={cn(
          'flex flex-row justify-center pb-[200px] pt-4 md:pt-10',
          className
        )}
        ref={messagesRef}
      >
        <Participants />
        <DrawingScreen />
        <div className="size-px" ref={visibilityRef} />
      </div>
    </div>
  )
}
