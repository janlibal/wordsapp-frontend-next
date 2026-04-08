'use client'

import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import WordCard from './WordCard'
import { getWords } from '@/src/services/words/word.service'
import { useSearchParams } from 'next/navigation'

export default function WordsList() {
  const [words, setWords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const searchParams = useSearchParams()
  const search = searchParams.get('search') || ''

  useEffect(() => {
    setLoading(true)

    getWords(search)
      .then(setWords)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [search])

  if (loading) return <p>Loading...</p>
  if (!words.length) return <p>No words found</p>

  return (
    <Box>
      {words.map((word) => (
        <WordCard key={word.id} {...word} />
      ))}
    </Box>
  )
}

export function WordsList1() {
  const [words, setWords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getWords()
      .then(setWords)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>

  if (!words.length) return <p>No words yet</p>

  return (
    <Box>
      {words.map((word) => (
        <WordCard key={word.id} {...word} />
      ))}
    </Box>
  )
}
