import { getWords } from '@/src/services/words/word.service'
import { Box, Stack, Typography } from '@mui/material'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { Word } from '@/src/types/words/word.type'
import { useUrlFilters } from '@/src/hooks/useFilters'
import { PageContainer } from '@/src/ui/pageContainer'
import { useEffect, useRef } from 'react'
import WordCard from './WordCard'

export default function WordsList() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search') || ''
  const tagIds = searchParams.get('tags')?.split(',').filter(Boolean) ?? []

  const LIMIT = 20

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ['words', search, tagIds],

      queryFn: ({ pageParam }) => getWords(search, tagIds, pageParam, LIMIT),

      initialPageParam: 1,

      getNextPageParam: (lastPage, pages) => {
        return lastPage?.length === LIMIT ? (pages?.length ?? 0) + 1 : undefined
      },

      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    })

  const words = data?.pages.flat() ?? []

  // infinite scroll trigger
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

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
