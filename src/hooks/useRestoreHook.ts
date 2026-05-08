import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Word } from '../types/words/word.type'
import { createWord } from '../services/words/word.service'
import { queryKeys } from './types/queryKeys'

export function useRestoreWord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (word: Word) =>
      createWord({
        content: word.content,
        tags: word.tags.map((t) => t.name),
      }),

    onMutate: async (word) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.words })

      const previous = queryClient.getQueryData<Word[]>(queryKeys.words)

      queryClient.setQueryData<Word[]>(queryKeys.words, (old = []) => [
        word,
        ...old,
      ])

      return { previous }
    },

    onError: (_err, _word, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.words, context.previous)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.words })
    },
  })
}
