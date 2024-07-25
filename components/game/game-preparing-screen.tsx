import { IconCatchMaind, IconSpinner } from '@/components/ui/icons'

export function GamePreparingScreen() {
  return (
    <div className="flex flex-col size-full justify-center items-center gap-4 rounded-lg border bg-background p-8">
      <IconCatchMaind className="animate-spin-slow size-24" />
      <h1 className="text-lg font-semibold">제시어를 준비 중 입니다.</h1>
    </div>
  )
}
