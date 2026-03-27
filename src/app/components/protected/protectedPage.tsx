'use client'


import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '../../context/authContext'

export default function ProtectedPage() {
  const { token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.push('/login')
    }
  }, [token])

  if (!token) return null

  return <div>Protected content</div>
}