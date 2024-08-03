import { QUERY_KEYS } from '@/lib/query/keys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface LeaderboardEntry {
  id: string
  name: string
  score: number
}

export const useLeaderboard = () => {
  const queryClient = useQueryClient()
  const fetchLeaderboard = async () => {
    const response = await fetch('leaderboard')
    const data = await response.json()
    return data
  }
  const { data } = useQuery<LeaderboardEntry[]>({
    queryKey: QUERY_KEYS.LEADER_BOARD,
    queryFn: () => fetchLeaderboard()
  })

  // use mutation to update the leaderboard
  const mutation = useMutation({
    mutationFn: async ({ name, score }: { name: string; score: number }) => {
      await fetch('/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, score })
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADER_BOARD })
    }
  })

  return {
    leaderboard: data,
    submitScore: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    refetch: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADER_BOARD })
  }
}
