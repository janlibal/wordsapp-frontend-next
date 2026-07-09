'use client'

import Profile from '@/src/components/auth/profile/Profile'
import { Typography } from '@mui/material'
import useProfile from '@/src/hooks/queries/useProfile'

export default function Page() {
  const { data, isLoading, error } = useProfile()

  if (isLoading) return <Typography>Loading...</Typography>

  if (error) return <Typography>Failed to load profile.</Typography>

  if (!data) return null

  return <Profile data={data} />
}
