'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Chip,
  Stack,
  Typography,
  Paper,
  Alert,
} from '@mui/material'
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

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

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

      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Failed to create word')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        maxWidth: 520,
        mx: 'auto',
        mt: { xs: 6, md: 10 },
        px: 2,
      }}
    >
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={1}>
          Add new word
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Save words, phrases, or anything worth remembering.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Word / Phrase"
              fullWidth
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              inputRef={inputRef}
            />

            <TagSelector value={selectedTags} onChange={setSelectedTags} />

            {/* ACTIONS */}
            <Box display="flex" justifyContent="flex-end" gap={1} mt={1}>
              <Button onClick={() => router.back()} color="inherit">
                Cancel
              </Button>

              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}
