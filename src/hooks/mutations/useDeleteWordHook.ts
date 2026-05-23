import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { deleteWord } from '../../services/words/word.service'
import { Word } from '../../types/words/word.type'
import { queryKeys } from '../types/queryKeys'
import { mapInfiniteWords } from '../../helpers/mapInfiniteWords'
import { Tag } from '@/src/types/tags/tag.type'

export function useDeleteWord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteWord(id),

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.words,
      })

      await queryClient.cancelQueries({
        queryKey: queryKeys.tags,
      })

      const previousWords = queryClient.getQueriesData<InfiniteData<Word[]>>({
        queryKey: queryKeys.words,
      })

      const previousTags = queryClient.getQueryData<Tag[]>(queryKeys.tags)

      let removedWord: Word | undefined

      // remove word + capture it (IMPORTANT)
      queryClient.setQueriesData<InfiniteData<Word[]>>(
        { queryKey: queryKeys.words },
        (old) => {
          if (!old) return old

          const newPages = old.pages.map((page) =>
            page.filter((w) => {
              if (w.id === id) {
                removedWord = w
                return false
              }
              return true
            })
          )

          return {
            ...old,
            pages: newPages,
          }
        }
      )

      // decrement tag counts using removed word
      if (removedWord) {
        queryClient.setQueryData<Tag[]>(queryKeys.tags, (old = []) =>
          old.map((tag) =>
            removedWord!.tags.some((t) => t.id === tag.id)
              ? { ...tag, count: tag.count - 1 }
              : tag
          )
        )
      }

      return { previousWords, previousTags }
    },

    onError: (_err, _id, context) => {
      if (context?.previousWords) {
        context.previousWords.forEach(([key, data]) => {
          queryClient.setQueryData(key, data)
        })
      }

      if (context?.previousTags) {
        queryClient.setQueryData(queryKeys.tags, context.previousTags)
      }
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

export function useDeleteWord2() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteWord(id),

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.words,
      })

      const previous = queryClient.getQueriesData<InfiniteData<Word[]>>({
        queryKey: queryKeys.words,
      })

      queryClient.setQueriesData<InfiniteData<Word[]>>(
        { queryKey: queryKeys.words },
        (old) => mapInfiniteWords(old, (word) => (word.id === id ? null : word))
      )

      return { previous }
    },

    onError: (_err, _id, context) => {
      context?.previous.forEach(([queryKey, data]) => {
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

export function useDeleteWord1() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteWord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] })
    },
  })
}
