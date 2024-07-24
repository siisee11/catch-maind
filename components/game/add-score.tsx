'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { calculatePercentile } from '@/lib/firebase/leaderboard/actions'
import { useGameStore } from '@/lib/game/store'
import { Label } from '@radix-ui/react-dropdown-menu'
import React from 'react'
import { useState } from 'react'

const AddScore: React.FC = () => {
  const { totalScore } = useGameStore(state => ({
    totalScore: state.totalScore
  }))
  const [name, setName] = useState('')
  const [percentile, setPercentile] = useState<number | null>(null)

  React.useEffect(() => {
    const fetchPercentile = async () => {
      const calculatedPercentile = await calculatePercentile(totalScore)
      setPercentile(calculatedPercentile)
    }

    fetchPercentile()
  }, [totalScore])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/leaderboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, score: totalScore })
    })
    setName('')
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="flex items-center justify-between gap-4">
        <CardTitle className="text-2xl">게임 결과</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-center w-full">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>점수</Label>
                <div className="text-2xl font-bold">{totalScore}</div>
              </div>
              <div className="flex items-center justify-between">
                <Label>상위</Label>
                {percentile !== null && (
                  <div className="text-2xl font-bold">
                    {percentile.toFixed(2)}%
                  </div>
                )}
              </div>

              <Label>이름</Label>
              <div className="flex flex-row gap-4">
                <Input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  onChange={e => setName(e.target.value)}
                  required
                />
                <Button type="submit" className="w-30">
                  제출
                </Button>
              </div>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}

export default AddScore
