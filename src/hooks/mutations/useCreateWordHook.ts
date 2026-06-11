import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { createWord } from '../../services/words/word.service'
import { Word } from '../../types/words/word.type'
import { Tag } from '../../types/tags/tag.type'
import { queryKeys } from '../types/queryKeys'

export default function useCreateWord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createWord,

    onMutate: async (newWord) => {
      // cancel ongoing requests
      await queryClient.cancelQueries({
        queryKey: queryKeys.words,
      })

      await queryClient.cancelQueries({
        queryKey: queryKeys.tags,
      })

      // snapshot previous caches
      const previousQueries = queryClient.getQueriesData<InfiniteData<Word[]>>({
        queryKey: queryKeys.words,
      })

      const previousTags = queryClient.getQueryData<Tag[]>(queryKeys.tags) || []

      // all existing tags
      const allTags = queryClient.getQueryData<Tag[]>(queryKeys.tags) || []

      // resolve optimistic tags
      //const resolvedTags = newWord.tags.map((name) => allTags.find((t) => t.name === name)).filter(Boolean) as Tag[]

      const resolvedTags = newWord.tags.map((name) => {
        const existing = allTags.find((t) => t.name === name)

        if (!existing) {
          return {
            id: name, // temporary but consistent
            name,
            count: 0,
          }
        }

        return existing
      })

      // optimistic word
      const optimisticWord: Word = {
        id: 'temp-' + Math.random().toString(36).slice(2),
        content: newWord.content,
        tags: resolvedTags,
        favorite: false,
        collectionId: newWord.collectionId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // optimistic tag count updates
      queryClient.setQueryData<Tag[]>(queryKeys.tags, (old = []) =>
        old.map((tag) =>
          newWord.tags.includes(tag.name)
            ? {
                ...tag,
                count: tag.count + 1,
              }
            : tag
        )
      )

      // optimistic word insertion
      previousQueries.forEach(([queryKey, oldData]) => {
        if (!oldData) return

        // validate query key structure
        if (
          !Array.isArray(queryKey) ||
          queryKey.length < 2 ||
          typeof queryKey[1] !== 'object'
        ) {
          return
        }

        const filters = queryKey[1] as {
          search?: string
          tagIds?: string[]
        }

        const search = filters.search ?? ''
        const tagIds = filters.tagIds ?? []

        const matchesSearch =
          !search ||
          optimisticWord.content.toLowerCase().includes(search.toLowerCase())

        //const matchesTags = !tagIds.length || optimisticWord.tags.some((t) => tagIds.includes(t.id))
        //const tagIds = filters?.tagIds ?? []

        const matchesTags =
          !tagIds.length ||
          optimisticWord.tags.some((t) => tagIds.includes(t.id))

        // skip nonmatching filtered queries
        if (!matchesSearch || !matchesTags) {
          return
        }

        const updated: InfiniteData<Word[]> = {
          ...oldData,

          pages: [
            [optimisticWord, ...(oldData.pages[0] ?? [])],
            ...oldData.pages.slice(1),
          ],
        }

        queryClient.setQueryData(queryKey, updated)
      })

      return {
        previousQueries,
        previousTags,
      }
    },

    onError: (_err, _vars, context) => {
      // rollback words
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })

      // rollback tags
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

/*export function useCreateWord44() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createWord,

    onMutate: async (newWord) => {
      // cancel outgoing fetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.words,
      })

      await queryClient.cancelQueries({
        queryKey: queryKeys.tags,
      })

      // snapshot previous cache
      const previousQueries = queryClient.getQueriesData<InfiniteData<Word[]>>({
        queryKey: queryKeys.words,
      })

      const previousTags = queryClient.getQueryData<Tag[]>(queryKeys.tags) || []

      // resolve full tag objects
      const allTags = queryClient.getQueryData<Tag[]>(queryKeys.tags) || []

      const resolvedTags = allTags.filter((t) => newWord.tags.includes(t.name))

      // optimistic word
      const optimisticWord: Word = {
        id: 'temp-' + Math.random().toString(36).slice(2),
        content: newWord.content,
        tags: resolvedTags,
      }

      // optimistic TAG COUNT updates
      queryClient.setQueryData<Tag[]>(queryKeys.tags, (old = []) =>
        old.map((tag) =>
          newWord.tags.includes(tag.name)
            ? {
                ...tag,
                count: tag.count + 1,
              }
            : tag
        )
      )

      // optimistic WORD updates
      previousQueries.forEach(([queryKey, oldData]) => {
        if (!oldData) return

        //const [_, search, tagIds] = queryKey as [string, string, string[]]
        const [, filters] = queryKey as [
          string,
          {
            search?: string
            tagIds?: string[]
          },
        ]

        const search = filters?.search ?? ''
        const tagIds = filters?.tagIds ?? []

        //const matchesSearch = !search || optimisticWord.content.toLowerCase().includes(search.toLowerCase())
        const matchesSearch =
          !search ||
          optimisticWord.content.toLowerCase().includes(search.toLowerCase())

        //const matchesTags = !tagIds?.length || optimisticWord.tags.some((t) => tagIds.includes(t.id))
        const matchesTags =
          !tagIds.length ||
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

      return {
        previousQueries,
        previousTags,
      }
    },

    onError: (_err, _vars, context) => {
      // rollback words
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })

      // rollback tags
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
}*/

/*export function useCreateWord333() {
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

        // skip malformed keys
        if (
          !Array.isArray(queryKey) ||
          queryKey.length < 2 ||
          typeof queryKey[1] !== 'object'
        ) {
          return
        }

        const filters = queryKey[1] as {
          search?: string
          tagIds?: string[]
        }

        const search = filters.search ?? ''
        const tagIds = filters.tagIds ?? []

        // const [_, search, tagIds] = queryKey as [string, string, string[]]

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
}*/
