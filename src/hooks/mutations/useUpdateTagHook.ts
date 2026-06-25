import { updateTag } from '@/src/services/tags/tag.service'
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { queryKeys } from '../types/queryKeys'
import { mapInfiniteWords } from '@/src/helpers/mapInfiniteWords'
import { Word } from '@/src/types/words/word.type'
import { Tag } from '@/src/types/tags/tag.type'

export function useUpdateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: Tag['id']
      data: { name: Tag['name'] }
    }) => updateTag(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.tags,
      })

      await queryClient.cancelQueries({
        queryKey: queryKeys.words,
      })

      const previousTags = queryClient.getQueryData<Tag[]>(queryKeys.tags)

      const previousWords = queryClient.getQueriesData<InfiniteData<Word[]>>({
        queryKey: queryKeys.words,
      })

      // optimistic tags update
      queryClient.setQueryData<Tag[]>(queryKeys.tags, (old = []) =>
        old.map((tag) =>
          tag.id === id
            ? {
                ...tag,
                name: data.name,
              }
            : tag
        )
      )

      // optimistic words update
      queryClient.setQueriesData<InfiniteData<Word[]>>(
        {
          queryKey: queryKeys.words,
        },
        (old) =>
          mapInfiniteWords(old, (word) => ({
            ...word,
            tags: word.tags.map((tag) =>
              tag.id === id
                ? {
                    ...tag,
                    name: data.name,
                  }
                : tag
            ),
          }))
      )

      return {
        previousTags,
        previousWords,
      }
    },

    onError: (_err, _vars, context) => {
      if (context?.previousTags) {
        queryClient.setQueryData(queryKeys.tags, context.previousTags)
      }

      context?.previousWords.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tags,
      })

      queryClient.invalidateQueries({
        queryKey: queryKeys.words,
      })
    },
  })
}
export function useUpdateTag1() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string } }) =>
      updateTag(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
