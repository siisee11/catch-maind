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
    <div className="flex flex-row justify-center">
      <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Submit Your Score</CardTitle>
            <CardDescription>
              Enter your username to submit your score.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Your Score</Label>
                <div className="text-2xl font-bold">{totalScore}</div>
              </div>
              {percentile !== null && (
                <div className="flex items-center justify-between">
                  <Label>Top </Label>
                  <div className="text-2xl font-bold">
                    {percentile.toFixed(2)}%
                  </div>
                </div>
              )}
              <Label>Username</Label>
              <Input
                type="text"
                id="username"
                placeholder="Enter your username"
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Submit Score
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default AddScore
