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
  return (
    <div className={`relative`}>
      <Avatar>
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{name.at(0)}</AvatarFallback>
      </Avatar>
      {/* <p>{name}</p> */}
      {/* <p>score: {score}</p> */}
      {message ? (
        <div
          className={`absolute top-2/3 left-[60px] w-[200px] z-50 p-4 bg-white/80 ${isCorrect ? 'border-2 border-green-600' : undefined} rounded-lg -translate-y-1/2 `}
        >
          <div className="absolute top-1/3 left-[-8px] size-0 border-y-8 border-y-transparent border-r-8 border-r-white/80 -translate-y-1/2" />
          <p className="text-black">{message}</p>
        </div>
      ) : null}
    </div>
  )
}
