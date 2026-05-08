import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { deleteWord } from '../services/words/word.service'
import { Word } from '../types/words/word.type'
import { queryKeys } from './types/queryKeys'
import { mapInfiniteWords } from '../helpers/mapInfiniteWords'

export function useDeleteWord() {
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

      /*onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.words,
      })

      // get ALL word queries
      const previousQueries = queryClient.getQueriesData<Word[]>({
        queryKey: queryKeys.words,
      })

      // update ALL caches
      previousQueries.forEach(([queryKey]) => {
        queryClient.setQueryData<Word[]>(queryKey, (old = []) =>
          old.filter((w) => w.id !== id)
        )
      })

      return { previousQueries }*/
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
