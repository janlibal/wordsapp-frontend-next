import { useMutation } from '@tanstack/react-query'
import { ChangePasswordDto, JoinDto } from '@/src/types/auth/auth.types'
import { changePassword, join } from '@/src/services/auth/auth.service'

export function useWaitlist() {
  return useMutation({
    mutationFn: (data: JoinDto) => join(data),

    onError: (error) => {
      console.error(error)
    },
  })
}
