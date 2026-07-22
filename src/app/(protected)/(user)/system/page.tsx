'use client'

import SystemInfo from '@/src/components/system/SystemInfo'
import useSystem from '@/src/hooks/queries/useSystem'
import { Typography } from '@mui/material'

export default function Page() {
  const { data, isLoading, error } = useSystem()

  if (isLoading) return <Typography>Loading...</Typography>

  if (error) return <Typography>Failed to load profile.</Typography>

  if (!data) return null

  return <SystemInfo data={data.result} />
}
