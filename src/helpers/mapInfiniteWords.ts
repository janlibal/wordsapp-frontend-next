import { InfiniteData } from '@tanstack/react-query'
import { Word } from '../types/words/word.type'

/*type Word = {
  id: string
  content: string
  tags: any[]
}*/

export function mapInfiniteWords(
  data: InfiniteData<Word[]> | undefined,
  fn: (word: Word) => Word | null
): InfiniteData<Word[]> | undefined {
  if (!data) return data

  return {
    ...data,
    pages: data.pages.map((page) => page.map(fn).filter(Boolean) as Word[]),
  }
}
