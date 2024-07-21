import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Participant } from '@/lib/game/store'

export type ParticipantProp = Participant

export function ParticipantCard({
  id,
  name,
  avatarUrl,
  message
}: ParticipantProp) {
  console.log('participant', id, name, avatarUrl, message)
  return (
    <div className="flex flex-row relative my-auto gap-4">
      <div className="flex flex-col w-full gap-2 rounded-lg border bg-background p-8">
        <Avatar>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p>{name}</p>
      </div>
      {message ? (
        <div className="absolute -right-24 top-4 rounded-lg border bg-white p-2 my-auto">
          <div className="flex-1 text-black">{message}</div>
        </div>
      ) : null}
    </div>
  )
}
