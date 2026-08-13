import { register } from '@/src/services/auth/auth.service'
import { RegisterDto } from '@/src/types/auth/auth.types'
import { useMutation } from '@tanstack/react-query'

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterDto) => register(data),

    onError: (error) => {
      console.error(error)
    },
  })
}
