'use client'

import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { getWords } from '@/src/services/words/word.service'
import { Box, Typography } from '@mui/material'
import WordCard from './WordCard'

export default function WordsList() {
  const searchParams = useSearchParams()
  const rawSearch = searchParams.get('search') || ''

  // 🧠 debounce here
  const [search] = useDebounce(rawSearch, 400)

  const { data: words = [], isFetching } = useQuery({
    queryKey: ['words', search],
    queryFn: () => getWords(search),
    placeholderData: (prev) => prev, // keeps previous results
  })

  return (
    <Box>
      {isFetching && (
        <Typography variant="body2" sx={{ opacity: 0.6 }}>
          Updating...
        </Typography>
      )}

      {words.map((word) => (
        <WordCard key={word.id} {...word} />
      ))}
    </Box>
  )
}

/*'use client'

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
}*/
