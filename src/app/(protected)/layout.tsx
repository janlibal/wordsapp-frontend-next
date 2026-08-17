'use client'

import { useAuth } from '../context/authContext'
import { useEffect } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { refreshAuth, loading, user } = useAuth()

  useEffect(() => {
    refreshAuth()
  }, [refreshAuth])

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading, user, router])

  if (loading) {
    return <div>Loading authentication...</div>
  }

  if (!user) {
    return null
  }

  return children
}
