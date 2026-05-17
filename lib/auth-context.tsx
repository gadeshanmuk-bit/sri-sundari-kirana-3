'use client'

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from './firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isDemo: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo user for when Firebase is not configured
const demoUser = {
  uid: 'demo-admin',
  email: 'admin@sundari.demo',
} as User

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const isDemo = !isFirebaseConfigured

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!isFirebaseConfigured || !auth) {
      // Demo mode - accept any credentials
      if (email && password) {
        setUser(demoUser)
        return
      }
      throw new Error('Please enter email and password')
    }
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signOut = async () => {
    if (!isFirebaseConfigured || !auth) {
      setUser(null)
      return
    }
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, isDemo }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
