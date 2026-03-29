// /context/AuthContext.tsx
'use client'

import { createContext, useContext, useState, useEffect } from 'react'

import { logout as logoutService } from '@/src/services/auth.service'
import { fetcher } from '@/src/lib/fetcher'

type User = {
  id: string
  name: string
  role: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
  refetchUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const res = await fetcher<User>('/api/v1/auth/me', {
        credentials: 'include',
      })
      setUser(res)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
    console.log('here ', user)
  }, [])

  const logout = async () => {
    await logoutService()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, logout, refetchUser: fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

/*
'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type AuthContextType = {
  token: string | null
  loginUser: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('token')
    if (stored) setToken(stored)
  }, [])

  const loginUser = (token: string) => {
    localStorage.setItem('token', token)
    setToken(token)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
*/
