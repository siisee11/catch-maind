import { Button } from '@/components/ui/button'
import { FaPen, FaEraser } from 'react-icons/fa6'
import { IconCheck, IconCopy } from '@/components/ui/icons'
import { submitUserDrawing } from '@/lib/game/actions'
import React, { ChangeEvent, useState } from 'react'

import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas'

export function DrawingScreen() {
  const canvasRef = React.useRef<ReactSketchCanvasRef>(null)
  const [strokeWidth, setStrokeWidth] = useState(5)
  const [eraserWidth, setEraserWidth] = useState(10)
  const [eraseMode, setEraseMode] = React.useState(false)

  const [isCopied, setIsCopied] = React.useState(false)

  const handleEraserClick = () => {
    setEraseMode(true)
    canvasRef.current?.eraseMode(true)
  }

  const handlePenClick = () => {
    setEraseMode(false)
    canvasRef.current?.eraseMode(false)
  }

  const handleStrokeWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStrokeWidth(+event.target.value)
  }

  const handleEraserWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEraserWidth(+event.target.value)
  }

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
    <div className="w-full max-w-4xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">Draw a sketch to get started</h1>
        <div className="flex flex-row gap-2 rounded-lg border bg-background p-1">
          <Button
            type="button"
            variant="ghost"
            disabled={!eraseMode}
            onClick={handlePenClick}
          >
            <FaPen />
          </Button>
          <Button
            variant="ghost"
            type="button"
            disabled={eraseMode}
            onClick={handleEraserClick}
          >
            <FaEraser />
          </Button>
          <input
            type="range"
            className="form-range"
            min="1"
            max="20"
            step="1"
            id="strokeWidth"
            value={eraseMode ? eraserWidth : strokeWidth}
            onChange={
              eraseMode ? handleEraserWidthChange : handleStrokeWidthChange
            }
          />
        </div>
        <ReactSketchCanvas
          ref={canvasRef}
          width="100%"
          height="800px"
          canvasColor="transparent"
          strokeColor="#ffffff"
          strokeWidth={strokeWidth}
          eraserWidth={strokeWidth}
        />
        <Button variant="ghost" size="icon" onClick={onCopy}>
          {isCopied ? <IconCheck /> : <IconCopy />}
          <span className="sr-only">Copy Image</span>
        </Button>
      </div>
    </div>
  )
}
