import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../types/queryKeys'
import { User } from '@/src/types/auth/auth.types'
import { getCurrentUser } from '@/src/services/auth/auth.service'
import { getAppInfo } from '@/src/services/app/app.service'
import { AppInfoResponse } from '@/src/types/app/app.types'

export default function useSystem() {
  return useQuery<AppInfoResponse>({
    queryKey: queryKeys.system,
    queryFn: () => getAppInfo(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}
