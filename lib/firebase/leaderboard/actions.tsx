'use server'

import db from '@/lib/firebase/db'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

export const calculatePercentile = async (score: number): Promise<number> => {
  const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'))
  const querySnapshot = await getDocs(q)
  const scores = querySnapshot.docs.map(doc => doc.data().score) as number[]

  if (scores.length === 0) {
    return 0.01 // If there are no scores, the current score is the highest.
  }

  if (score === 0) {
    return 99.99 // If the score is 0, the current score is the
  }

  const index = scores.findIndex(s => s >= score)
  const percentile = ((index + 1) / (scores.length + 1)) * 100

  return percentile
}
