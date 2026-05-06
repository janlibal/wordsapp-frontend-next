import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteWord } from '../services/words/word.service'
import { Word } from '../types/words/word.type'
import { queryKeys } from './types/queryKeys'

export function useDeleteWord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteWord(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.words })

      const previous = queryClient.getQueryData<Word[]>(queryKeys.words)

      queryClient.setQueryData<Word[]>(queryKeys.words, (old = []) =>
        old.filter((w) => w.id !== id)
      )

      return { previous }
    },

    onSuccess: () => {
      // nothing — UI already correct
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.words, context.previous)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.words })
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
