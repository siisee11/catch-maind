import { useGameStore } from '@/lib/game/store'
import { useEffect } from 'react'
import './logo.css'
import { CatchMaindLogo } from '@/components/ui/icons'

export function GameNotStartedScreen() {
  const { prepare } = useGameStore(state => ({
    prepare: state.prepare,
    updateDrawing: state.updateDrawing
  }))

  const draw = () => {
    const wrapper = document.querySelector('.wrapper svg')
    if (wrapper) {
      wrapper.classList.add('active')
    }
  }

  useEffect(() => {
    draw()
  }, [])

  return (
    <div className="relative flex flex-col size-full justify-center items-center rounded-lg border bg-background p-4">
      <div className="wrapper mb-48 md:w-[500]">
        <CatchMaindLogo />
      </div>

      <div className="absolute bottom-24 md:bottom-1/4 inset-x-0 flex flex-row justify-center">
        <button
          className="animate-scale-up-center rounded-full bg-primary p-4 mx-auto text-xl font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onClick={prepare}
        >
          GO
        </button>
      </div>
    </div>
  )
}
