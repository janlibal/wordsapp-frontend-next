import { apiFetch } from '@/src/lib/fetcher'
import { Tag } from '@/src/types/tags/tag.type'
import { TagsResponse } from '@/src/types/tags/tags.response.type'

export async function getTags(
  search?: string,
  tagIds: string[] = []
): Promise<Tag[]> {
  const params = new URLSearchParams()

  if (search) params.set('search', search)
  if (tagIds.length) params.set('tags', tagIds.join(','))

  const query = params.toString()

  const res = await apiFetch<TagsResponse>(
    query ? `/api/api/v1/tags?${query}` : '/api/api/v1/tags'
  )

  return res.data
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
