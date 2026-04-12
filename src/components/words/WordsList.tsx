'use client'

import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { getWords } from '@/src/services/words/word.service'
import { Box, Typography } from '@mui/material'
import WordCard from './WordCard'

export default function WordsList() {
  const searchParams = useSearchParams()

  // 🔍 read from URL (single source of truth)
  const search = searchParams.get('search') || ''
  const rawTags = searchParams.get('tags') || ''
  const tagIds = rawTags ? rawTags.split(',') : []

  // 📦 fetch data
  const { data: words = [], isFetching } = useQuery({
    queryKey: ['words', search, tagIds],
    queryFn: () => getWords(search, tagIds),
    staleTime: 30_000,
  })

  return (
    <Box>
      {isFetching && <p style={{ opacity: 0.5 }}>Updating...</p>}

      {!words.length && !isFetching && <p>No words found</p>}

      {words.map((word) => (
        <WordCard key={word.id} {...word} search={search} />
      ))}
    </Box>
  )
}

/*export default function WordsList() {
  const searchParams = useSearchParams()

  const rawSearch = searchParams.get('search') || ''
  const rawTags = searchParams.get('tags') || ''

  const tags = rawTags ? rawTags.split(',') : []

  // debounce only search
  const [search] = useDebounce(rawSearch, 400)

  const { data: words = [], isFetching } = useQuery({
    queryKey: ['words', search, tags],
    queryFn: () => getWords(search, tags),
    placeholderData: (prev) => prev,
  })

  return (
    <Box>
      {isFetching && <p style={{ opacity: 0.5 }}>Updating...</p>}

      {words.map((word) => (
        <WordCard key={word.id} {...word} />
      ))}
    </Box>
  )
}*/

/*export default function WordsList() {
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
  */

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
