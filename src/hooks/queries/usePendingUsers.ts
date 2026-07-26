import { useQuery } from '@tanstack/react-query'
import { getPendingUsers } from '@/src/services/admin/admin.service'
import { User } from '@/src/types/auth/auth.types'
import { queryKeys } from '../types/queryKeys'

export default function usePendingUsers() {
  return useQuery<User[]>({
    queryKey: queryKeys.admin.pending,
    queryFn: () => getPendingUsers(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}
