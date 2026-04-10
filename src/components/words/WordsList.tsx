'use client'

import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getWords } from '@/src/services/words/word.service'
import { Box } from '@mui/material'
import WordCard from './WordCard'

export default function WordsList() {
  const searchParams = useSearchParams()
  const search = searchParams.get('search') || ''

  const { data: words = [], isFetching } = useQuery({
    queryKey: ['words', search],
    queryFn: () => getWords(search),
  })

  return (
    <Box>
      {isFetching && <p>Searching...</p>}

      {words.map((word) => (
        <WordCard key={word.id} {...word} />
      ))}
    </Box>
  )
}
