import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteWord } from '../services/words/word.service'
import { Word } from '../types/words/word.type'

export function useDeleteWord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteWord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] })
    },
  })
}
