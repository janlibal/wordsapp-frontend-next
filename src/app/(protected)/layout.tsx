'use client'

import { useAuth } from '../context/authContext'
import { useEffect } from 'react'
import { Box, CircularProgress } from '@mui/material'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { refreshAuth, loading, user } = useAuth()

  console.log('[ProtectedLayout]', { loading, user })

  useEffect(() => {
    console.log('[ProtectedLayout] calling refreshAuth()')
    refreshAuth()
  }, [])

  if (loading) {
    return <div>Loading authentication...</div>
  }

  if (!user) {
    return <div>Not authenticated</div>
  }

  return children
}

export function ProtectedLayoutOriginalThatWorked({
  children,
}: {
  children: React.ReactNode
}) {
  //const { refreshAuth, loading, user } = useAuth()

  /*useEffect(() => {
    refreshAuth()
  }, [])*/

  /* if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }*/

  return (
    <div style={{ background: 'red', padding: 30 }}>
      Protected layout reached
    </div>
  )
}

export function ProtectedLayout1({ children }: { children: React.ReactNode }) {
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

  return children
}
