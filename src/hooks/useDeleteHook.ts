import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteWord } from '../services/words/word.service'
import { Word } from '../types/words/word.type'
import { queryKeys } from './types/queryKeys'

export function useDeleteWord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteWord(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.words,
      })

      // get ALL word queries
      const previousQueries = queryClient.getQueriesData<Word[]>({
        queryKey: queryKeys.words,
      })

      // update ALL caches
      previousQueries.forEach(([queryKey]) => {
        queryClient.setQueryData<Word[]>(queryKey, (old = []) =>
          old.filter((w) => w.id !== id)
        )
      })

      return { previousQueries }
    },

    onError: (_err, _id, context) => {
      // rollback ALL caches
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.words,
      })
    },
  })
}

export function useDeleteWord1() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteWord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] })
    },
  })
}
