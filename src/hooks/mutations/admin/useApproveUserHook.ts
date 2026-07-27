import { approveUser } from '@/src/services/admin/admin.service'
import { User } from '@/src/types/auth/auth.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../types/queryKeys'

export function useApproveUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approveUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.pending,
      })
    },

    onError: (error) => {
      console.error(error)
    },
  })
}
