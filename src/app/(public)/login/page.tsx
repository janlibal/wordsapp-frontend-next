import { Suspense } from 'react'
import LoginForm from '../../../components/auth/login/LoginForm'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
