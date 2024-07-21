import { Separator } from '@/components/ui/separator'
import { Session } from '@/lib/types'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export interface ParticipantProp {
  id: string
  name: string
}

export function Participant({ id, name }: ParticipantProp) {
  return (
    <div className="flex flex-row relative my-auto gap-4">
      <div className="flex flex-col w-full gap-2 rounded-lg border bg-background p-8">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p>{name}</p>
      </div>
      <div className="absolute -right-24 top-4 rounded-lg border bg-white p-2 my-auto">
        <div className="flex-1 text-black">message</div>
      </div>
    </div>
  )
}
