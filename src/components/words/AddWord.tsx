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
import { Tag } from '@/src/types/tags/tag.type'
import { getTags } from '@/src/services/tags/tag.service'
import Autocomplete from '@mui/material/Autocomplete'
import TagSelector from '../tags/TagSelector'
import useCreateWord from '@/src/hooks/useCreateHook'
import { useSnackbar } from '@/src/hooks/SnacbarProvider'

export default function AddWord() {
  const router = useRouter()

  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])

  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement | null>(null)
  const [snackbar, setSnackbar] = useState<string | null>(null)

  const createMutation = useCreateWord()
  const isLoading = createMutation.isPending
  const showSnackbar = useSnackbar()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    createMutation.mutate(
      {
        content,
        tags: selectedTags.map((t) => t.name),
      },
      {
        onSuccess: () => {
          showSnackbar({ message: 'Content created' })
          router.push('/')
        },
        onError: (err: any) => {
          ;(showSnackbar({ message: 'Failed to create word' }),
            setError(err.message || 'Failed to create word'))
        },
      }
    )
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

              <Button type="submit" variant="contained" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}
