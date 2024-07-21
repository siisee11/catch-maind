import { Button } from '@/components/ui/button'
import { IconArrowRight, IconSpinner } from '@/components/ui/icons'

import { useGameStore } from '@/lib/game/store'

export function GamePreparingScreen() {
  const { play, updateDrawing } = useGameStore(state => ({
    play: state.play,
    updateDrawing: state.updateDrawing
  }))

  return (
    <div className="w-full max-w-4xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">제시어를 준비 중 입니다.</h1>

        <IconSpinner className="mr-2 animate-spin" />
      </div>
    </div>
  )
}
