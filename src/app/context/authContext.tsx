'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, logout } from '@/src/services/auth/auth.service'
import { User } from '@/src/types/auth/auth.types'
import { usePathname } from 'next/navigation'

type AuthContextType = {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
  //refetchUser: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const fetchUser = async () => {
    setLoading(true)

    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  /*useEffect(() => {
    fetchUser()
  }, [])*/

  // 🔥 GLOBAL LOGOUT LISTENER
  useEffect(() => {
    console.log('AuthProvider mounted')
    const handleLogout = () => {
      console.log('Logging out from:', pathname)
      console.log('AuthProvider: logout event received')
      setUser(null)

      console.log('Before router.push')
      router.replace('/login')
      console.log('After router.push')
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
       // refetchUser: fetchUser,
        refreshAuth: fetchUser,
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
