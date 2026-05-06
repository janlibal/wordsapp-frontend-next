import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateWord } from '../services/words/word.service'
import { Word } from '../types/words/word.type'
import { queryKeys } from './types/queryKeys'

export function useUpdateWord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { content: string } }) =>
      updateWord(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.words })

      const previous = queryClient.getQueryData<Word[]>(queryKeys.words)

      queryClient.setQueryData<Word[]>(queryKeys.words, (old = []) =>
        old.map((w) => (w.id === id ? { ...w, content: data.content } : w))
      )

      return { previous }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.words, context.previous)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.words })
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
