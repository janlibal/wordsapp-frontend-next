import { deleteCollection } from '@/src/services/collections/collections.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../types/queryKeys'
import { Collection } from '@/src/types/collections/collections.type'

export function useDeleteCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: Collection['id']) => deleteCollection(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.collections,
      })
    },
  })
}

export function useDeleteCollectionWithOptimisticUpdate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: Collection['id']) => deleteCollection(id),

    onMutate: async (id: Collection['id']) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.collections,
      })

      const previousCollections = queryClient.getQueryData<Collection[]>(
        queryKeys.collections
      )

      queryClient.setQueryData<Collection[]>(
        queryKeys.collections,
        (old = []) => old.filter((collection) => collection.id !== id)
      )

      return {
        previousCollections,
      }
    },

    onError: (_err, _id, context) => {
      if (context?.previousCollections) {
        queryClient.setQueryData(
          queryKeys.collections,
          context.previousCollections
        )
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.collections,
      })
    },
  })
}
