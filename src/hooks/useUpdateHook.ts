import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateWord } from '../services/words/word.service'
import { Word } from '../types/words/word.type'
import { queryKeys } from './types/queryKeys'

export function useUpdateWord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: { content: string }
    }) => updateWord(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.words,
      })

      // snapshot ALL matching queries
      const previousQueries =
        queryClient.getQueriesData<Word[]>({
          queryKey: queryKeys.words,
        })

      // update ALL caches
      previousQueries.forEach(([queryKey]) => {
        queryClient.setQueryData<Word[]>(
          queryKey,
          (old = []) =>
            old.map((w) =>
              w.id === id
                ? {
                    ...w,
                    content: data.content,
                  }
                : w
            )
        )
      })

      return { previousQueries }
    },

    onError: (_err, _vars, context) => {
      // rollback ALL caches
      context?.previousQueries.forEach(
        ([queryKey, data]) => {
          queryClient.setQueryData(
            queryKey,
            data
          )
        }
      )
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.words,
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
