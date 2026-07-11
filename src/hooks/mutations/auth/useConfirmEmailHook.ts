import { useMutation } from '@tanstack/react-query'
import { ConfirmEmailDto } from '@/src/types/auth/auth.types'
import { confirmEmail } from '@/src/services/auth/auth.service'

export function useConfirmEmail() {
  return useMutation({
    mutationFn: (data: ConfirmEmailDto) => confirmEmail(data),

    onError: (error) => {
      console.error(error)
    },
  })
}
