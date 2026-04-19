import { getWords } from '@/src/services/words/word.service'
import { Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import WordCard from './WordCard'
import { Word } from '@/src/types/words/word.type'
import { useUrlFilters } from '@/src/hooks/useFilters'

export default function WordsList() {
  const searchParams = useSearchParams()

  const tagIds = searchParams.get('tags')?.split(',').filter(Boolean) ?? []

  const { search, tags } = useUrlFilters()

  const { data: words = [], isFetching } = useQuery({
    queryKey: ['words', search, tags],
    queryFn: () => getWords(search, tags),
    staleTime: 30_000,
  })

  return (
    <Box>
      {isFetching && <p>Loading...</p>}

      {!words.length && !isFetching && <p>No words found</p>}

      {words.map((word) => (
        <WordCard key={word.id} search={search} {...word} />
      ))}
    </Box>
  )
}
