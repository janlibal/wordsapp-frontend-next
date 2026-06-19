import { Word } from '@/src/types/words/word.type'
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { queryKeys } from '../types/queryKeys'
import { getWords } from '@/src/services/words/word.service'
import { CollectionsOutlined } from '@mui/icons-material'

type Params = {
  search: string
  tagIds: string[]
  collectionId?: string
}

const LIMIT = 20

export default function useWords({ search, tagIds, collectionId }: Params) {
  const query = useInfiniteQuery({
    queryKey: [
      ...queryKeys.words,
      {
        search,
        tagIds: [...tagIds].sort(),
        collectionId,
      },
    ],

    queryFn: ({ pageParam }) =>
      getWords(search, tagIds, collectionId, pageParam, LIMIT),

    initialPageParam: 1,

    placeholderData: (previousData) => previousData,

    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === LIMIT ? pages.length + 1 : undefined
    },
  })

  return {
    ...query,
    words: query.data?.pages.flat() ?? [],
  }
}
