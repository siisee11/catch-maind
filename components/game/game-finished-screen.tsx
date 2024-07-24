import { CatchMaindBannerImage } from '@/components/catch-maind-banner'
import AddScore from '@/components/game/add-score'
import { Leaderboard } from '@/components/game/leaderboard'
import { Button } from '@/components/ui/button'

import { useGameStore } from '@/lib/game/store'
import { FaPaintbrush } from 'react-icons/fa6'

export function GameFinishedScreen() {
  const { prepare } = useGameStore(state => ({
    prepare: state.prepare,
    updateDrawing: state.updateDrawing
  }))

  return (
    <div className="flex flex-col size-full overflow-y-auto	gap-2 rounded-lg border bg-background p-4">
      <CatchMaindBannerImage />
      <div className="flex flex-col gap-2 md:flex-row">
        <AddScore />
        <Leaderboard />
      </div>
      <Button className="w-100 mx-auto mt-8" size="lg" onClick={prepare}>
        <FaPaintbrush className="mr-2 size-4" />
        다시하기
      </Button>
    </div>
  )
}
