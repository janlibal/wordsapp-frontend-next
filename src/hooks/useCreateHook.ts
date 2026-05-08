import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
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

      const previousQueries = queryClient.getQueriesData<InfiniteData<Word[]>>({
        queryKey: queryKeys.words,
      })

      const allTags = queryClient.getQueryData<Tag[]>(queryKeys.tags) || []

      const resolvedTags = allTags.filter((t) => newWord.tags.includes(t.name))

      const optimisticWord: Word = {
        id: 'temp-' + Math.random().toString(36).slice(2),
        content: newWord.content,
        tags: resolvedTags,
      }

      // apply update per cache entry (NO inner setQueriesData)
      previousQueries.forEach(([queryKey, oldData]) => {
        if (!oldData) return

        const [_, search, tagIds] = queryKey as [string, string, string[]]

        const matchesSearch =
          !search ||
          optimisticWord.content.toLowerCase().includes(search.toLowerCase())

        const matchesTags =
          !tagIds?.length ||
          optimisticWord.tags.some((t) => tagIds.includes(t.id))

        if (!matchesSearch || !matchesTags) return

        const updated: InfiniteData<Word[]> = {
          ...oldData,
          pages: [
            [optimisticWord, ...(oldData.pages[0] ?? [])],
            ...oldData.pages.slice(1),
          ],
        }

        queryClient.setQueryData(queryKey, updated)
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
