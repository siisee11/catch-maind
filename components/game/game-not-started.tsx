import { Button } from '@/components/ui/button'
import { FaPaintbrush } from 'react-icons/fa6'

import { useGameStore } from '@/lib/game/store'
import { CatchMaindBannerImage } from '@/components/catch-maind-banner'

export function GameNotStartedScreen() {
  const { prepare } = useGameStore(state => ({
    prepare: state.prepare,
    updateDrawing: state.updateDrawing
  }))

  return (
    <div className="w-full max-w-4xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <CatchMaindBannerImage />
        <Button className="w-100 mx-auto mt-8" size="lg" onClick={prepare}>
          <FaPaintbrush className="mr-2 size-4" />
          시작하기
        </Button>
      </div>
    </div>
  )
}
