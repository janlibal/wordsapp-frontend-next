import CreatePasswordComponent from '@/src/components/auth/create-password/CreatePasswordComponent'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatePasswordComponent />
    </Suspense>
  )
}
