import { Separator } from '@/components/ui/separator'
import { Session } from '@/lib/types'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Participant } from '@/components/participant'
import { nanoid } from 'nanoid'

export interface ParticipantsProp {
  session?: Session
}

export function Participants({ session }: ParticipantsProp) {
  return (
    <div className="flex flex-col relative px-4 gap-4">
      <Participant id={nanoid()} name="Tonald Drump" />
      <Participant id={nanoid()} name="Musk Melon" />
      <div className="h-full" />
    </div>
  )
}
