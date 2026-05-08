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
      await queryClient.cancelQueries({
        queryKey: queryKeys.words,
      })

      // snapshot ALL caches
      const previousQueries = queryClient.getQueriesData<Word[]>({
        queryKey: queryKeys.words,
      })

      const allTags = queryClient.getQueryData<Tag[]>(queryKeys.tags) || []

      const resolvedTags = allTags.filter((t) => newWord.tags.includes(t.name))

      const optimisticWord: Word = {
        id: 'temp-' + Math.random().toString(36).slice(2),

        content: newWord.content,
        tags: resolvedTags,
      }

      // update ALL matching caches carefully
      previousQueries.forEach(([queryKey]) => {
        const [_, search, tagIds] = queryKey as [string, string, string[]]

        // search filtering
        const matchesSearch =
          !search ||
          optimisticWord.content.toLowerCase().includes(search.toLowerCase())

        // tag filtering
        const matchesTags =
          !tagIds?.length ||
          optimisticWord.tags.some((t) => tagIds.includes(t.id))

        // skip unrelated caches
        if (!matchesSearch || !matchesTags) {
          return
        }

        queryClient.setQueryData<Word[]>(queryKey, (old = []) => [
          optimisticWord,
          ...old,
        ])
      })

      return { previousQueries }
    },

    onError: (_err, _vars, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.words,
      })

      queryClient.invalidateQueries({
        queryKey: queryKeys.tags,
      })
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
