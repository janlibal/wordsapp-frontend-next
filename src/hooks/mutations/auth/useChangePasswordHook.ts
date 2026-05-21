import { useMutation } from '@tanstack/react-query'
import { ChangePasswordDto } from '@/src/types/auth/auth.types'
import { changePassword } from '@/src/services/auth/auth.service'

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordDto) => changePassword(data),

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
