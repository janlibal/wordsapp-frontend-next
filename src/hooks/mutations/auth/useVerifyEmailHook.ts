import { useMutation } from '@tanstack/react-query'
import { ConfirmEmailDto, VerifyEmailDto } from '@/src/types/auth/auth.types'
import { confirmEmail, verifyEmail } from '@/src/services/auth/auth.service'

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (data: VerifyEmailDto) => verifyEmail(data),

    onError: (error) => {
      console.error(error)
    },
  })
}
