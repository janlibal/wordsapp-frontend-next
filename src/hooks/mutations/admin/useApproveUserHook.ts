import { approveUser } from '@/src/services/admin/admin.service'
import { User } from '@/src/types/auth/auth.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../types/queryKeys'

export function useApproveUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approveUser,

    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.admin.pending,
      })

      const previous = queryClient.getQueryData<User[]>(queryKeys.admin.pending)

      queryClient.setQueryData<User[]>(queryKeys.admin.pending, (old = []) =>
        old.filter((u) => u.id !== id)
      )

      return { previous }
    },

    onError: (_err, _id, context) => {
      queryClient.setQueryData(queryKeys.admin.pending, context?.previous)
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.pending,
      })
    },
  })
}

export function useApproveUser1() {
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
