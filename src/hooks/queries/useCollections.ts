import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../types/queryKeys'
import { Collection } from '@/src/types/collections/collections.type'
import { getCollections } from '@/src/services/collections/collections.service'

export default function useCollections() {
  return useQuery<Collection[]>({
    queryKey: queryKeys.collections,
    queryFn: () => getCollections(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}
