'use client'

import { useEffect, useRef, useState } from 'react'
import { Box, TextField, Button, Chip, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { createWord } from '@/src/services/words/word.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Tag } from '@/src/types/tags/tag.type'
import { getTags } from '@/src/services/tags/tag.service'
import Autocomplete from '@mui/material/Autocomplete'
import TagSelector from '../tags/TagSelector'

export default function AddWord() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement | null>(null)

  // ✅ submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await createWord({
        content,
        tags: selectedTags.map((t) => t.name),
      })

      queryClient.invalidateQueries({ queryKey: ['words'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      queryClient.refetchQueries({ queryKey: ['tags'] })

      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Failed to create word')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: 'auto',
        mt: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h5">Add new word / phrase</Typography>

      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Word / Phrase"
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          inputRef={inputRef}
        />

        {/* ✅ TAG SELECTOR */}
        <TagSelector value={selectedTags} onChange={setSelectedTags} />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </Box>
  )
}
