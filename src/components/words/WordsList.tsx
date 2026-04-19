import { getWords } from '@/src/services/words/word.service'
import { Box, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import WordCard from './WordCard'
import { Word } from '@/src/types/words/word.type'
import { useUrlFilters } from '@/src/hooks/useFilters'
import { PageContainer } from '@/src/ui/pageContainer'

export default function WordsList() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search') || ''
  const tagIds = searchParams.get('tags')?.split(',').filter(Boolean) ?? []

  const { data: words = [], isFetching } = useQuery({
    queryKey: ['words', search, tagIds],
    queryFn: () => getWords(search, tagIds),
    staleTime: 30_000,
  })

  return (
    <PageContainer>
      <Stack spacing={2}>
        {isFetching && <Typography>Loading...</Typography>}

        {!words.length && !isFetching && (
          <Typography color="text.secondary">No words found</Typography>
        )}

        {words.map((word) => (
          <WordCard key={word.id} {...word} />
        ))}
      </Stack>
    </PageContainer>
  )
}
