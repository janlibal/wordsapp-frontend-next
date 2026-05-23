import { Word } from '@/src/types/words/word.type'
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { queryKeys } from '../types/queryKeys'
import { getWords } from '@/src/services/words/word.service'

type Params = {
  search: string
  tagIds: string[]
}

const LIMIT = 20

export default function useWords({ search, tagIds }: Params) {
  const query = useInfiniteQuery({
    queryKey: [
      ...queryKeys.words,
      {
        search,
        tagIds: [...tagIds].sort(),
      },
    ],

    queryFn: ({ pageParam }) => getWords(search, tagIds, pageParam, LIMIT),

    initialPageParam: 1,

    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === LIMIT ? pages.length + 1 : undefined
    },

    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  return {
    ...query,
    words: query.data?.pages.flat() ?? [],
  }
}

export function useWords1({ search, tagIds }: Params) {
  const query = useInfiniteQuery<
    Word[],
    Error,
    InfiniteData<Word[]>,
    unknown[],
    number
  >({
    queryKey: [
      queryKeys.words,
      {
        search,
        tagIds: [...tagIds].sort(),
      },
    ],

    queryFn: ({ pageParam }) => getWords(search, tagIds, pageParam, LIMIT),

    initialPageParam: 1,

    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === LIMIT ? pages.length + 1 : undefined
    },

    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  return {
    ...query,
    words: query.data?.pages.flat() ?? [],
  }
}
