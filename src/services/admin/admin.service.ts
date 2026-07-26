import { apiFetch } from '../../lib/fetcher'
import { User } from '../../types/auth/auth.types'

export async function getPendingUsers(): Promise<User[]> {
  const res = await apiFetch<{ result: User[] }>('/api/api/v1/admin/pending', {
    method: 'GET',
  })
  return res.result
}
