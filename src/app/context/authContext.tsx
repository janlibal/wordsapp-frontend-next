'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, logout } from '@/src/services/auth/auth.service'
import { User } from '@/src/types/auth/auth.types'

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
  const router = useRouter()

  const fetchUser = async () => {
    setLoading(true)
    try {
      const user = await getCurrentUser()
      setUser(user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  // 🔥 GLOBAL LOGOUT LISTENER
  useEffect(() => {
    const handleLogout = () => {
      setUser(null)
      router.push('/login')
    }

    window.addEventListener('auth:logout', handleLogout)

    return () => {
      window.removeEventListener('auth:logout', handleLogout)
    }
  }, [router])

  // ✅ Proper logout
  const logoutUser = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Logout failed', err)
    } finally {
      // 🔥 delegate everything to global handler
      window.dispatchEvent(new Event('auth:logout'))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout: logoutUser,
        refetchUser: fetchUser,
      }}
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
