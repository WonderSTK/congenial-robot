import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

initializeApp(JSON.parse(import.meta.env.VITE_APP_FIREBASE_CONFIG))

export const firestoreDb = getFirestore()
export const realtimeDb = getDatabase()
export const storage = getStorage()
