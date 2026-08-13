'use client'

import { useAuth } from '@/src/app/context/authContext'
import { RoleEnum } from '@/src/types/auth/auth.types'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role?.id !== RoleEnum.admin) {
      router.replace('/')
    }
  }, [user, router])

  if (!user || user.role?.id !== RoleEnum.admin) {
    return null
  }

  return <>{children}</>
}
