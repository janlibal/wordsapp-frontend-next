import { useMutation } from '@tanstack/react-query'
import { login } from '../../../services/auth/auth.service'
import { useAuth } from '../../../app/context/authContext'

export function useLogin() {
  const { refreshAuth } = useAuth()

  return useMutation({
    mutationFn: login,

    onSuccess: async () => {
      await refreshAuth()
    },
  })
}
