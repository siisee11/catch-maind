import { Button } from '@/components/ui/button'
import { IconCheck, IconCopy } from '@/components/ui/icons'
import { submitUserDrawing } from '@/lib/game/actions'
import React from 'react'

import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas'

export function DrawingScreen() {
  const canvasRef = React.useRef<ReactSketchCanvasRef>(null)
  const [isCopied, setIsCopied] = React.useState(false)

  function dataURLToBase64(dataURL: string) {
    // Split the data URL to get the base64 part
    const base64Data = dataURL.split(',')[1]
    return base64Data
  }

  const onCopy = async () => {
    const dataUrl = await canvasRef.current?.exportImage('png')
    if (dataUrl) {
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = 'image.png' // Specify the filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setIsCopied(true)
      const base64 = dataURLToBase64(dataUrl)
      const res = await submitUserDrawing(base64)
      console.log(res)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">Draw a sketch to get started</h1>
        <ReactSketchCanvas
          ref={canvasRef}
          width="100%"
          height="800px"
          canvasColor="transparent"
          strokeColor="#ffffff"
        />
        <Button variant="ghost" size="icon" onClick={onCopy}>
          {isCopied ? <IconCheck /> : <IconCopy />}
          <span className="sr-only">Copy Image</span>
        </Button>
      </div>
    </div>
  )
}
