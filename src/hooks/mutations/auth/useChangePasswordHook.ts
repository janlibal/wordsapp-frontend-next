import { useMutation } from '@tanstack/react-query'
import { ChangePasswordDto } from './change-password.dto'

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
