import { getWords } from '@/src/services/words/word.service'
import { Box, Stack, Typography } from '@mui/material'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { Word } from '@/src/types/words/word.type'
import { useUrlFilters } from '@/src/hooks/useFilters'
import { PageContainer } from '@/src/ui/pageContainer'
import { useEffect, useMemo, useRef } from 'react'
import WordCard from './WordCard'
import { queryKeys } from '@/src/hooks/types/queryKeys'
import useWords from '@/src/hooks/queries/useWords'
import useInfiniteScroll from '@/src/hooks/useInfiniteScroll'
import WordSortSelector from './WordSortSelector'

export default function WordsList() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search') || ''
  const tagIds = searchParams.get('tags')?.split(',').filter(Boolean) ?? []
  const collectionId = searchParams.get('collectionId') ?? undefined

  const sort = searchParams.get('sort') ?? 'updated'

  const { words, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useWords({
      search,
      tagIds,
      collectionId,
    })

  const sortedWords = useMemo(() => {
    const result = [...words]

    switch (sort) {
      case 'favorites':
        return result.sort((a, b) => {
          if (a.favorite === b.favorite) return 0
          return a.favorite ? -1 : 1
        })

      case 'oldest':
        return result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )

      case 'updated':
      default:
        return result.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )

      case 'newest':
        return result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    }
  }, [words, sort])

  // infinite scroll trigger
  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  })

  return (
    <PageContainer>
      <Stack
        spacing={2}
        sx={{
          width: '100%',
          minWidth: 0,
        }}
      >
        {isFetching && <Typography>Loading...</Typography>}

        {!words.length && !isFetching && (
          <Typography color="text.secondary">No words found</Typography>
        )}

        <WordSortSelector />

        {sortedWords.map((word) => (
          <WordCard key={word.id} {...word} search={search} />
        ))}

        <Box ref={loadMoreRef} />

        {isFetchingNextPage && <Typography>Loading more...</Typography>}
      </Stack>
    </PageContainer>
  )
}

/*export default function WordsList() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search') || ''
  const tagIds = searchParams.get('tags')?.split(',').filter(Boolean) ?? []

  const { data: words = [], isFetching } = useQuery({
    queryKey: ['words', search, tagIds],
    queryFn: () => getWords(search, tagIds),
    //staleTime: 30_000,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })

  return (
    <PageContainer>
      <Stack spacing={2}>
        {isFetching && <Typography>Loading...</Typography>}

        {!words.length && !isFetching && (
          <Typography color="text.secondary">No words found</Typography>
        )}

        {words.map((word) => (
          <WordCard key={word.id} {...word} search={search} />
        ))}
      </Stack>
    </PageContainer>
  )
}
*/
