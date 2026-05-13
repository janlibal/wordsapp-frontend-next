import { updateTag } from '@/src/services/tags/tag.service'
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

export function useUpdateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string } }) =>
      updateTag(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
