import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createWord } from '../services/words/word.service'

export default function useCreateWord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { content: string; tags: string[] }) => createWord(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
