import ConfirmEmailComponent from '@/src/components/auth/confirm-email/ConfirmEmailComponent'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmEmailComponent />
    </Suspense>
  )
}

/*type Props = {
  searchParams: Promise<{
    hash?: string
  }>
}

export default async function Page({ searchParams }: Props) {
  const { hash } = await searchParams

  return (
    <div>
      <h1>Confirm email</h1>

      <p>Hash:</p>

      <pre>{hash}</pre>
    </div>
  )
}*/
