import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../types/queryKeys'
import { createCollection } from '@/src/services/collections/collections.service'

export function useCreateCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCollection,

    onSuccess: (collection) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.collections,
      })
    },
  })
}
