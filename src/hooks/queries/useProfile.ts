import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../types/queryKeys'
import { User } from '@/src/types/auth/auth.types'
import { getCurrentUser } from '@/src/services/auth/auth.service'

export default function useProfile() {
  return useQuery<User>({
    queryKey: queryKeys.profile,
    queryFn: () => getCurrentUser(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}
