import { API_BASE_PATH } from '@/src/config/api'
import { apiFetch } from '@/src/lib/fetcher'
import { Tag } from '@/src/types/tags/tag.type'
import { CreateWordDto } from '@/src/types/words/create.word.dto'
import { Word } from '@/src/types/words/word.type'

export function createWord(data: CreateWordDto): Promise<void> {
  return apiFetch<void>(
    `${API_BASE_PATH}/words`,
    //'/api/api/v1/words',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  )
}

export async function addTagToWord(wordId: Word['id'], tagId: Tag['id']) {
  return apiFetch(
    `${API_BASE_PATH}/words/${wordId}/tags/${tagId}`,
    //`/api/api/v1/words/${wordId}/tags/${tagId}`,
    {
      method: 'POST',
    }
  )
}

export async function removeTagFromWord(wordId: Word['id'], tagId: Tag['id']) {
  return apiFetch(
    `${API_BASE_PATH}/words/${wordId}/tags/${tagId}`,
    //`/api/api/v1/words/${wordId}/tags/${tagId}`,
    {
      method: 'DELETE',
    }
  )
}

export function deleteWord(id: Word['id']) {
  return apiFetch(
    `${API_BASE_PATH}/words/${id}`,
    //`/api/api/v1/words/${id}`,
    {
      method: 'DELETE',
    }
  )
}

/*export async function getWords(): Promise<Word[]> {
  const res = await apiFetch<{ result: Word[] }>('/api/api/v1/words', {
    method: 'GET',
  })
  return res.result
}*/

/*export async function getWords(search?: string): Promise<Word[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : ''

  const res = await apiFetch<{ result: Word[] }>(`/api/api/v1/words${query}`, {
    method: 'GET',
  })
  return res.result
}*/

export async function getWords1(
  search?: string,
  tags: string[] = []
): Promise<Word[]> {
  const params = new URLSearchParams()

  if (search) params.set('search', search)
  if (tags.length) params.set('tags', tags.join(','))

  const res = await apiFetch<{ result: Word[] }>(
    `/api/api/v1/words?${params.toString()}`
  )

  return res.result
}

export async function getWords(
  search?: string,
  tagIds: string[] = [],
  collectionId?: string | undefined,
  page = 1,
  limit = 20
): Promise<Word[]> {
  const params = new URLSearchParams()

  params.set('page', String(page))
  params.set('limit', String(limit))
  if (search) params.set('search', search)
  if (tagIds.length) params.set('tags', tagIds.join(','))
  if (collectionId) params.set('collectionId', collectionId)

  const res = await apiFetch<{ data: Word[] }>(
    `${API_BASE_PATH}/words?${params.toString()}`,
    //`/api/api/v1/words?${params.toString()}`,
    {
      method: 'GET',
    }
  )

  return res.data
}

export async function getWords100(
  search?: string,
  tagIds: string[] = []
): Promise<Word[]> {
  const params = new URLSearchParams()

  if (search) params.set('search', search)
  if (tagIds.length) params.set('tags', tagIds.join(','))

  const res = await apiFetch<{ result: Word[] }>(
    `/api/api/v1/words?${params.toString()}`
  )

  return res.result
}

export async function updateWord(
  id: Word['id'], //string
  data: {
    content?: Word['content'] //string
    favorite?: Word['favorite'] //boolean
    tags?: string[]
  }
) {
  return apiFetch<Omit<Word, 'userId'>>(
    `${API_BASE_PATH}/words/${id}`,
    //`/api/api/v1/words/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  )
}
