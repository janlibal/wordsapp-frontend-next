import { apiFetch } from '@/src/lib/fetcher'
import { Collection } from '@/src/types/collections/collections.type'
import { CreateCollectionDto } from '@/src/types/collections/create.collection.dto'

export async function getCollections(
  search?: string,
  collectionIds: string[] = []
): Promise<Collection[]> {
  const params = new URLSearchParams()

  if (search) params.set('search', search)
  if (collectionIds.length) params.set('collections', collectionIds.join(','))

  const res = await apiFetch<{ result: Collection[] }>(
    `/api/api/v1/collections`,
    {
      method: 'GET',
    }
  )
  return res.result
}

export function createCollection(
  data: CreateCollectionDto
): Promise<Collection> {
  return apiFetch<Collection>('/api/api/v1/collections', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateCollection(
  id: string,
  data: {
    name?: string
  }
) {
  return apiFetch<Omit<Collection, 'userId'>>(`/api/api/v1/collections/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteCollection(id: string) {
  return apiFetch(`/api/api/v1/collections/${id}`, {
    method: 'DELETE',
  })
}
