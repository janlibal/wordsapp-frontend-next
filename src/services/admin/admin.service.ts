import { API_BASE_PATH } from '@/src/config/api'
import { apiFetch } from '../../lib/fetcher'
import { User } from '../../types/auth/auth.types'

export async function getPendingUsers(): Promise<User[]> {
  const res = await apiFetch<{ data: User[] }>(
    //'/api/api/v1/admin/pending',
    `${API_BASE_PATH}/admin/pending`,
    {
      method: 'GET',
    }
  )
  return res.data
}

export async function approveUser(id: User['id']): Promise<void> {
  await apiFetch(`${API_BASE_PATH}/admin/waitlist/${id}/approve`, {
    method: 'PATCH',
    //body: JSON.stringify(id)
  })
}
