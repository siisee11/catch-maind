import app from '@/lib/firebase/app'
import { getFirestore } from 'firebase/firestore'

const db = getFirestore(app)
export default db
