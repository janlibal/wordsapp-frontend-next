'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/src/services/auth.service'
import MeInfo from '@/src/components/auth/MeInfo'
import { User } from '@/src/types/auth.types'

export default function Page() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    getCurrentUser().then(setUser).catch(console.error)
  }, [])

  if (!user) return <p>Loading...</p>

  return <MeInfo data={user} />
}