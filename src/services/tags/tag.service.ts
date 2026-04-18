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
  console.log('results: ', res.result)
  return res.result
}
