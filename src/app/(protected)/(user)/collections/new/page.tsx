import { Suspense } from 'react'
import AddCollection from '@/src/components/collections/AddCollection'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddCollection />
    </Suspense>
  )
}
