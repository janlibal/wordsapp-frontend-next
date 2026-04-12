import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateWord } from '../services/words/word.service'

export function useUpdateWord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: { content: string; tags: string[] }
    }) => {
      return updateWord(id, data)
    },

    // ⚡ OPTIMISTIC UPDATE
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['words'] })

      const queries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ['words'] })

      const previous = queries.map((q) => ({
        queryKey: q.queryKey,
        data: q.state.data,
      }))

      queries.forEach((q) => {
        queryClient.setQueryData<any[]>(q.queryKey, (old = []) =>
          old.map((word) =>
            word.id === id
              ? { ...word, content: data.content, tags: data.tags }
              : word
          )
        )
      })

      return { previous }
    },

    // ❌ rollback on error
    onError: (err, _, context) => {
      context?.previous?.forEach(({ queryKey, data }) => {
        queryClient.setQueryData(queryKey, data)
      })
    },

    // 🔄 always refetch after
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
