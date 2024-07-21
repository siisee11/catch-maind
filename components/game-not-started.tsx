import { Button } from '@/components/ui/button'
import { FaDove } from 'react-icons/fa6'

import { useGameStore } from '@/lib/game/store'

export function GameNotStartedScreen() {
  const { prepare } = useGameStore(state => ({
    prepare: state.prepare,
    updateDrawing: state.updateDrawing
  }))

  return (
    <div className="w-full max-w-4xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <Button onClick={prepare}>
          <FaDove className="mr-2 size-4" />
          시작하기
        </Button>
      </div>
    </div>
  )
}
