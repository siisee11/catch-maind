import { nanoid } from '@/lib/utils'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { Game } from '@/components/game/game'

export const metadata = {
  title: 'Catch mind'
}

export default async function GamePage() {
  const id = nanoid()
  const session = (await auth()) as Session
  return <Game id={id} session={session} />
}
