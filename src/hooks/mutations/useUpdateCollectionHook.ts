import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../types/queryKeys'
import { updateCollection } from '@/src/services/collections/collections.service'
import { Collection } from '@/src/types/collections/collections.type'

export function useUpdateCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string } }) =>
      updateCollection(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.collections,
      })
    },
  })
}

export function useUpdateCollectionWithOptimisticUpdate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string } }) =>
      updateCollection(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.collections,
      })

      const previousCollections = queryClient.getQueryData<Collection[]>(
        queryKeys.collections
      )

      queryClient.setQueryData<Collection[]>(
        queryKeys.collections,
        (old = []) =>
          old.map((collection) =>
            collection.id === id
              ? {
                  ...collection,
                  name: data.name,
                }
              : collection
          )
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
