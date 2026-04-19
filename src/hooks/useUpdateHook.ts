import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateWord } from '../services/words/word.service'
import { Word } from '../types/words/word.type'

export function useUpdateWord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: { content: string; tagIds: string[] }
    }) => updateWord(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

export function useUpdateWord0() {
  const queryClient = useQueryClient()

  return useMutation({
    //mutationFn: ({ id, data }: { id: string; data: { content: string } }) => updateWord(id, data),

    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: { content: string; tagIds: string[] }
    }) => updateWord(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },

    // ⚡ instant UI update (safe version)
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['words'] })

      const previous = queryClient.getQueriesData<Word[]>({
        queryKey: ['words'],
      })

      previous.forEach(([key, words]) => {
        if (!words) return

        queryClient.setQueryData<Word[]>(key, (old = []) =>
          old.map((w) => (w.id === id ? { ...w, content: data.content } : w))
        )
      })

      return { previous }
    },

    // rollback if something fails
    onError: (_err, _vars, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
    },

    // ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] })
    },
  })
}
