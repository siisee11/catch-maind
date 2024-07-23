import { NextRequest, NextResponse } from 'next/server'
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit
} from 'firebase/firestore'
import db from '@/lib/firebase/db'

export async function GET(request: NextRequest) {
  const q = query(
    collection(db, 'leaderboard'),
    orderBy('score', 'desc'),
    limit(10)
  )
  const querySnapshot = await getDocs(q)
  const leaderboard = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
  return NextResponse.json(leaderboard, { status: 200 })
}

export async function POST(request: NextRequest) {
  const { name, score } = await request.json()
  await addDoc(collection(db, 'leaderboard'), { name, score })
  return NextResponse.json({ message: 'Score added' }, { status: 201 })
}
