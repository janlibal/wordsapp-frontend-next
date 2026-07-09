'use client'

import Profile from '@/src/components/auth/profile/Profile'
import { Typography } from '@mui/material'
import { useAuth } from '../context/authContext'

export default function Page() {
  const { user, loading } = useAuth()

  if (loading) return <Typography>Loading...</Typography>
  if (!user) return <Typography>No user</Typography>

  return <Profile data={user} />
}
