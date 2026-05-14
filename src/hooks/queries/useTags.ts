import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../types/queryKeys'
import { getTags } from '@/src/services/tags/tag.service'
import { Tag } from '@/src/types/tags/tag.type'

export default function useTags() {
  return useQuery<Tag[]>({
    queryKey: queryKeys.tags,
    queryFn: () => getTags(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}
