'use client'

import { useAuth } from '../context/authContext'
import { useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { Box, CircularProgress } from '@mui/material'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { refreshAuth, loading, user } = useAuth()

  useEffect(() => {
    refreshAuth()
  }, [])

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return null
  }

  return <AppLayout>{children}</AppLayout>
}
