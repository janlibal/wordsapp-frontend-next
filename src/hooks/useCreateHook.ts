import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createWord } from '../services/words/word.service'
import { Word } from '../types/words/word.type'
import { Tag } from '../types/tags/tag.type'
import { queryKeys } from './types/queryKeys'

export default function useCreateWord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { content: string; tags: string[] }) => createWord(data),

    onMutate: async (newWord) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.words })

      const previous = queryClient.getQueryData<Word[]>(queryKeys.words)

      const allTags = queryClient.getQueryData<Tag[]>(queryKeys.tags) || []

      const resolvedTags = allTags.filter((t) => newWord.tags.includes(t.name))

      const optimisticWord: Word = {
        id: 'temp-' + Math.random().toString(36).slice(2),
        content: newWord.content,
        tags: resolvedTags,
      }

      queryClient.setQueryData<Word[]>(queryKeys.words, (old = []) => [
        optimisticWord,
        ...old,
      ])

      return { previous }
    },

    onError: (_err, _newWord, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.words, context.previous)
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.words })
      queryClient.invalidateQueries({ queryKey: queryKeys.tags })
    },
  })
}

export function useCreateWord1() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { content: string; tags: string[] }) => createWord(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
