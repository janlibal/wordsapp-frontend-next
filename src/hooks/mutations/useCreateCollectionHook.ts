import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../types/queryKeys'
import { createCollection } from '@/src/services/collections/collections.service'
import { Collection } from '@/src/types/collections/collections.type'

export function useCreateCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCollection,

    onMutate: async (newCollection) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.collections,
      })

      const previousCollections =
        queryClient.getQueryData<Collection[]>(queryKeys.collections) ?? []

      const optimisticCollection: Collection = {
        id: `temp-${Date.now()}`,
        name: newCollection.name.trim(),
        count: 0,
      }

      queryClient.setQueryData<Collection[]>(
        queryKeys.collections,
        (old = []) => [optimisticCollection, ...old]
      )

      return {
        previousCollections,
      }
    },

    onError: (_err, _vars, context) => {
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

export function useCreateCollection1() {
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
