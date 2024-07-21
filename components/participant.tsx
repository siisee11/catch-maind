import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Participant } from '@/lib/game/store'

export type ParticipantProp = Participant

export function ParticipantCard({
  id,
  name,
  avatarUrl,
  message,
  score,
  isCorrect
}: ParticipantProp) {
  console.log('ParticipantCard', id, name, avatarUrl, message, score, isCorrect)
  return (
    <div className="flex flex-row relative my-auto gap-4">
      <div
        className={`flex flex-col w-full gap-2 rounded-lg border bg-background p-8 ${isCorrect ? 'border-green-600' : undefined} `}
      >
        <Avatar>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{name.at(0)}</AvatarFallback>
        </Avatar>
        <p>{name}</p>
        <p>score: {score}</p>
      </div>
      {message ? (
        <div className="absolute top-1/3 left-[200px] w-[200px] p-4 bg-white rounded-lg -translate-y-1/2">
          <div className="absolute top-1/3 left-[-8px] size-0 border-y-8 border-y-transparent border-r-8 border-r-white -translate-y-1/2" />
          <p className="text-black">{message}</p>
        </div>
      ) : null}
    </div>
  )
}
