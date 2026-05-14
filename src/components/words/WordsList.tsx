import { getWords } from '@/src/services/words/word.service'
import { Box, Stack, Typography } from '@mui/material'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { Word } from '@/src/types/words/word.type'
import { useUrlFilters } from '@/src/hooks/useFilters'
import { PageContainer } from '@/src/ui/pageContainer'
import { useEffect, useRef } from 'react'
import WordCard from './WordCard'
import { queryKeys } from '@/src/hooks/types/queryKeys'
import useWords from '@/src/hooks/queries/useWords'
import useInfiniteScroll from '@/src/hooks/useInfiniteScroll'

export default function WordsList() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search') || ''
  const tagIds = searchParams.get('tags')?.split(',').filter(Boolean) ?? []

  const LIMIT = 20

  const { words, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useWords({
      search,
      tagIds,
    })

  // infinite scroll trigger
  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
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

        {/* 👇 infinite scroll trigger */}
        <div ref={loadMoreRef} />

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
