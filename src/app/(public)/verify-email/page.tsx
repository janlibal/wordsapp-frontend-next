import VerifyEmailComponent from '@/src/components/auth/verify-email/VerifyEmailComponent'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailComponent />
    </Suspense>
  )
}
