import { apiFetch } from '@/src/lib/fetcher'
import { CreateWordDto } from '@/src/types/words/create.word.dto'
import { Word } from '@/src/types/words/word.type'

export function createWord(data: CreateWordDto): Promise<void> {
  return apiFetch<void>('/api/api/v1/words', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function addTagToWord(wordId: string, tagId: string) {
  return apiFetch(`/api/api/v1/words/${wordId}/tags/${tagId}`, {
    method: 'POST',
  })
}

export async function removeTagFromWord(wordId: string, tagId: string) {
  return apiFetch(`/api/api/v1/words/${wordId}/tags/${tagId}`, {
    method: 'DELETE',
  })
}

export function deleteWord(id: string) {
  return apiFetch(`/api/api/v1/words/${id}`, {
    method: 'DELETE',
  })
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
  page = 1,
  limit = 20
): Promise<Word[]> {
  const params = new URLSearchParams()

  params.set('page', String(page))
  params.set('limit', String(limit))
  if (search) params.set('search', search)
  if (tagIds.length) params.set('tags', tagIds.join(','))

  const res = await apiFetch<{ result: Word[] }>(
    `/api/api/v1/words?${params.toString()}`
  )

  return res.result
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
  id: string,
  data: {
    content?: string
    tags?: string[]
  }
) {
  return apiFetch<Omit<Word, 'userId'>>(`/api/api/v1/words/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}
