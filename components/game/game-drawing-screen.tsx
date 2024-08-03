import { Button } from '@/components/ui/button'
import { TbPlayerTrackNextFilled } from 'react-icons/tb'
import { FaPen, FaEraser } from 'react-icons/fa6'
import { IoMdRefresh } from 'react-icons/io'
import { IconCheck, IconClose, IconCopy } from '@/components/ui/icons'
import React, { ChangeEvent, useState, useEffect } from 'react'

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
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [eraserWidth, setEraserWidth] = useState(30)
  const [eraseMode, setEraseMode] = React.useState(false)

  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setIsDarkMode(mediaQuery.matches)
    }
  }, [])

  useEffect(() => {
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

  // const onCopy = async () => {
  //   const dataUrl = await canvasRef.current?.exportImage('png')
  //   if (dataUrl) {
  //     const link = document.createElement('a')
  //     link.href = dataUrl
  //     link.download = 'image.png' // Specify the filename
  //     document.body.appendChild(link)
  //     link.click()
  //     document.body.removeChild(link)
  //     setIsCopied(true)
  //   }
  // }

  return (
    <div className="flex flex-col w-full gap-2 rounded-lg border bg-background p-4">
      <div className="flex flex-row gap-2 justify-center rounded-lg border bg-background p-2">
        남은 시간: <span className="font-semibold">{remainingTime}(초)</span>
        제시어: <span className="font-semibold">{keyword}</span>
      </div>
      <div className="flex flex-row gap-2 rounded-lg border bg-background p-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!eraseMode}
          onClick={handlePenClick}
        >
          <FaPen />
        </Button>
        <Button
          variant="ghost"
          type="button"
          size="icon"
          disabled={eraseMode}
          onClick={handleEraserClick}
        >
          <FaEraser />
        </Button>
        <input
          type="range"
          className="form-range"
          min="1"
          max="40"
          step="1"
          id="strokeWidth"
          value={eraseMode ? eraserWidth : strokeWidth}
          onChange={
            eraseMode ? handleEraserWidthChange : handleStrokeWidthChange
          }
        />
        <Button
          variant="ghost"
          type="button"
          size="icon"
          onClick={handleEraseAllClick}
        >
          <IoMdRefresh />
        </Button>
      </div>
      <ReactSketchCanvas
        className="size-full"
        height={'calc(100vh-80)'}
        ref={canvasRef}
        canvasColor="transparent"
        strokeColor={isDarkMode ? 'white' : 'black'}
        strokeWidth={strokeWidth}
        eraserWidth={eraserWidth}
      />
      <div className="absolute p-1 bottom-1 right-1 flex flex-row gap-2 rounded-lg border bg-white/10  backdrop-blur-sm">
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
