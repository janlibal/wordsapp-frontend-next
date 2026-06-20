import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { Collection } from '@/src/types/collections/collections.type'
import { Word } from '@/src/types/words/word.type'
import { updateWord } from '@/src/services/words/word.service'
import { queryKeys } from '../types/queryKeys'
import { mapInfiniteWords } from '@/src/helpers/mapInfiniteWords'

export function useUpdateWord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<Pick<Word, 'content' | 'favorite' | 'collectionId'>>
    }) => updateWord(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.words,
      })

      await queryClient.cancelQueries({
        queryKey: queryKeys.collections,
      })

      const previousWords = queryClient.getQueriesData<InfiniteData<Word[]>>({
        queryKey: queryKeys.words,
      })

      const previousCollections = queryClient.getQueryData<Collection[]>(
        queryKeys.collections
      )

      const collections = previousCollections ?? []

      // 👇 capture the current word BEFORE optimistic changes
      const previousWord = queryClient
        .getQueryData<InfiniteData<Word[]>>(queryKeys.words)
        ?.pages.flat()
        .find((w) => w.id === id)

      const oldCollectionId = previousWord?.collectionId

      // 👇 optimistic word update
      queryClient.setQueriesData<InfiniteData<Word[]>>(
        { queryKey: queryKeys.words },
        (old) =>
          mapInfiniteWords(old, (word) => {
            if (word.id !== id) {
              return word
            }

            const updatedCollection =
              data.collectionId !== undefined
                ? collections.find((c) => c.id === data.collectionId)
                : word.collection

            return {
              ...word,
              ...data,

              collectionId:
                data.collectionId !== undefined
                  ? data.collectionId
                  : word.collectionId,

              collection: updatedCollection
                ? {
                    id: updatedCollection.id,
                    name: updatedCollection.name,
                  }
                : undefined,
            }
          })
      )

      // 👇 optimistic collection counts
      queryClient.setQueryData<Collection[]>(
        queryKeys.collections,
        (old = []) =>
          old.map((collection) => {
            let count = collection.count

            // leaving old collection
            if (
              oldCollectionId &&
              collection.id === oldCollectionId &&
              oldCollectionId !== data.collectionId
            ) {
              count = Math.max(0, count - 1)
            }

            // entering new collection
            if (
              data.collectionId &&
              collection.id === data.collectionId &&
              oldCollectionId !== data.collectionId
            ) {
              count = count + 1
            }

            return {
              ...collection,
              count,
            }
          })
      )

      return {
        previousWords,
        previousCollections,
      }
    },

    onError: (_err, _vars, context) => {
      context?.previousWords.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })

      if (context?.previousCollections) {
        queryClient.setQueryData(
          queryKeys.collections,
          context.previousCollections
        )
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.words,
      })

      queryClient.invalidateQueries({
        queryKey: queryKeys.collections,
      })
    },
  })
}

export function useUpdateWord1() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { content: string } }) =>
      updateWord(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] })
    },
  })
}
