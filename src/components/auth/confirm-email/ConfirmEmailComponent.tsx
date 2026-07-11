'use client'

import { useConfirmEmail } from '@/src/hooks/mutations/auth/useConfirmEmailHook'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function ConfirmEmailComponent() {
  const searchParams = useSearchParams()

  const hash = searchParams.get('hash')

  const { mutate, isPending, isSuccess, isError } = useConfirmEmail()

  /*const called = useRef(false)

  useEffect(() => {
    if (!hash || called.current) return

    called.current = true
    mutate({ hash })
  }, [hash, mutate])*/

  useEffect(() => {
    if (hash) {
      mutate({ hash })
    }
  }, [hash, mutate])
  return (
    <div>
      <h1>Confirm email</h1>

      <p>Hash:</p>

      <pre>{hash}</pre>
    </div>
  )
}
