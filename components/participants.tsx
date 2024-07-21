import { Session } from '@/lib/types'

import { ParticipantCard } from '@/components/participant'
import { useGameStore } from '@/lib/game/store'

export interface ParticipantsProp {
  session?: Session
}

export function Participants({ session }: ParticipantsProp) {
  const participants = useGameStore(state => state.participants)

  return (
    <div className="flex flex-col relative px-4 gap-4">
      {participants.map(participant => (
        <ParticipantCard key={participant.id} {...participant} />
      ))}
      <div className="h-full" />
    </div>
  )
}
