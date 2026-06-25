import { apiFetch } from '@/src/lib/fetcher'
import { Tag } from '@/src/types/tags/tag.type'

export async function getTags(
  search?: string,
  tagIds: string[] = []
): Promise<Tag[]> {
  const params = new URLSearchParams()

  if (search) params.set('search', search)
  if (tagIds.length) params.set('tags', tagIds.join(','))

  const res = await apiFetch<{ result: Tag[] }>(`/api/api/v1/tags`)
  return res.result
}

export async function updateTag(
  id: Tag['id'], //string,
  data: {
    name?: Tag['name'] //string
  }
) {
  return apiFetch<Omit<Tag, 'userId'>>(`/api/api/v1/tags/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}
