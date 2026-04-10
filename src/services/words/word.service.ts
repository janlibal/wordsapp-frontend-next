import { apiFetch } from '@/src/lib/fetcher'
import { CreateWordDto } from '@/src/types/words/create.word.dto'
import { Word } from '@/src/types/words/word.type'

export function createWord(data: CreateWordDto): Promise<void> {
  return apiFetch<void>('/api/api/v1/words', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/*export async function getWords(): Promise<Word[]> {
  const res = await apiFetch<{ result: Word[] }>('/api/api/v1/words', {
    method: 'GET',
  })
  return res.result
}*/

export async function getWords(search?: string): Promise<Word[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : ''

  const res = await apiFetch<{ result: Word[] }>(`/api/api/v1/words${query}`, {
    method: 'GET',
  })
  return res.result
}

export async function updateWord(
  id: string,
  data: {
    content?: string
    //tags?: string[]
  }
) {
  console.log('id ', id)
  console.log('content ', data.content)
  //console.log('tags ', data.tags)
  return apiFetch<Omit<Word, 'userId'>>(`/api/api/v1/words/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}
