/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/4UgfYrFe4ob
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
**/
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { IconTrophy } from '@/components/ui/icons'
import React from 'react'

interface LeaderboardEntry {
  id: string
  name: string
  score: number
}

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = React.useState<LeaderboardEntry[]>([])

  React.useEffect(() => {
    const fetchLeaderboard = async () => {
      const response = await fetch('leaderboard')
      const data = await response.json()
      setLeaderboard(data)
    }

    fetchLeaderboard()
  }, [])

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="flex items-center justify-between gap-4">
        <CardTitle className="text-2xl">Leaderboard</CardTitle>
        <div className="flex items-center gap-2 text-md text-muted-foreground">
          <IconTrophy className="size-4" />
          <span>Top Scorers</span>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Username</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((entry, index) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-8 border">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>{entry.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span>{entry.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {entry.score}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}