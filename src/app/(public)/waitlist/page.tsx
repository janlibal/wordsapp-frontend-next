import WaitlistComponent from '@/src/components/auth/waitlist/WaitlistComponent'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WaitlistComponent />
    </Suspense>
  )
}
