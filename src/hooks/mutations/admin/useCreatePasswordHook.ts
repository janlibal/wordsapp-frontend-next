import { createPassword } from '@/src/services/auth/auth.service'
import { CreatePasswordDto } from '@/src/types/auth/auth.types'
import { useMutation } from '@tanstack/react-query'

export function useCreatePassword() {
  return useMutation({
    mutationFn: (data: CreatePasswordDto) => createPassword(data),

    onSuccess: () => {
      // optional:
      // snackbar
      // close dialog
      // logout
    },

    onError: (error) => {
      console.error(error)
    },
  })
}
