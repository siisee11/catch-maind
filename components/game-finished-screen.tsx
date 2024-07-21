import { Button } from '@/components/ui/button'
import { IconSpinner } from '@/components/ui/icons'

import { useGameStore } from '@/lib/game/store'

export function GameFinishedScreen() {
  const { play, updateDrawing } = useGameStore(state => ({
    play: state.play,
    updateDrawing: state.updateDrawing
  }))

  return (
    <div className="w-full max-w-4xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <Button>다시하기</Button>
      </div>
    </div>
  )
}
