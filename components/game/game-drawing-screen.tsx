import { Button } from '@/components/ui/button'
import { TbPlayerTrackNextFilled } from 'react-icons/tb'
import { FaPen, FaEraser } from 'react-icons/fa6'
import { IoMdRefresh } from 'react-icons/io'
import { IconCheck, IconClose, IconCopy } from '@/components/ui/icons'
import React, { ChangeEvent, useState } from 'react'

import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas'
import { useGameStore } from '@/lib/game/store'

export function DrawingScreen() {
  const { updateDrawing, keyword, finish, remainingTime, prepareNext } =
    useGameStore(state => ({
      keyword: state.keyword,
      play: state.play,
      finish: state.finish,
      updateDrawing: state.updateDrawing,
      remainingTime: state.remainingTime,
      prepareNext: state.prepareNext
    }))
  const canvasRef = React.useRef<ReactSketchCanvasRef>(null)
  const [strokeWidth, setStrokeWidth] = useState(5)
  const [eraserWidth, setEraserWidth] = useState(10)
  const [eraseMode, setEraseMode] = React.useState(false)

  const [isCopied, setIsCopied] = React.useState(false)

  React.useEffect(() => {
    const fn = async () => {
      const dataUrl = await canvasRef.current?.exportImage('png')
      if (dataUrl) {
        const base64 = dataURLToBase64(dataUrl)
        updateDrawing(base64)
      }
    }
    const interval = setInterval(fn, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleEraserClick = () => {
    setEraseMode(true)
    canvasRef.current?.eraseMode(true)
  }

  const handlePenClick = () => {
    setEraseMode(false)
    canvasRef.current?.eraseMode(false)
  }

  const handleEraseAllClick = () => {
    canvasRef.current?.resetCanvas()
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
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
      <div className="flex flex-row gap-2 justify-center rounded-lg border bg-background p-4">
        남은 시간: <span className="font-semibold">{remainingTime}(초)</span>
      </div>
      <div className="flex flex-row gap-2 justify-center rounded-lg border bg-background p-4">
        제시어: <span className="font-semibold">{keyword}</span>
      </div>
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
        <Button variant="ghost" type="button" onClick={handleEraseAllClick}>
          <IoMdRefresh />
        </Button>
      </div>
      <ReactSketchCanvas
        ref={canvasRef}
        width="100%"
        height="600px"
        canvasColor="transparent"
        strokeColor="#ffffff"
        strokeWidth={strokeWidth}
        eraserWidth={strokeWidth}
      />
      <div className="flex flex-row gap-2 rounded-lg border bg-background p-1">
        <Button variant="ghost" size="icon" onClick={onCopy}>
          {isCopied ? <IconCheck /> : <IconCopy />}
          <span className="sr-only">Copy Image</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={prepareNext}>
          <TbPlayerTrackNextFilled />
          <span className="sr-only">Next</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={finish}>
          <IconClose />
          <span className="sr-only">Finish</span>
        </Button>
      </div>
    </div>
  )
}
