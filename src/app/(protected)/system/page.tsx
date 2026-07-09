'use client'

import SystemInfo from '@/src/components/system/SystemInfo'
import { getAppInfo } from '@/src/services/app/app.service'
import { Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../context/authContext'

export default function Page() {
  const { user, loading } = useAuth()

  if (loading) return <Typography>Loading...</Typography>
  if (!user) return <Typography>No user</Typography>

  const { data, isLoading, error } = useQuery({
    queryKey: ['system'],
    queryFn: () => getAppInfo(),
    //staleTime: 60_000,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })

  if (isLoading) return <Typography>Loading...</Typography>
  if (error) return <p>Failed to load system info</p>
  if (!data) return <p>No data</p>

  return <SystemInfo data={data.result} />
}
