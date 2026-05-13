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

  const inputRef = useRef<HTMLInputElement | null>(null)

  const createMutation = useCreateWord()
  const isLoading = createMutation.isPending

  const showSnackbar = useSnackbar()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    createMutation.mutate(
      {
        content,
        tags: selectedTags.map((t) => t.name),
      },
      {
        onSuccess: () => {
          showSnackbar({
            message: 'Content created',
          })
          router.push('/')

          // allow snackbar to render before navigation
          /*setTimeout(() => {
            router.push('/')
          }, 150)*/
        },

        onError: (err: any) => {
          showSnackbar({
            message: err.message || 'Failed to create word',
          })
        },
      }
    )
  }

  return (
    <Box
      sx={{
        minHeight: { md: '80vh' },
        display: 'flex',
        alignItems: { md: 'center' },
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 520,
          p: { xs: 2.5, sm: 4 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h5" mb={1}>
          Add new word
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Save words, phrases, or anything worth remembering.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              label="Word / Phrase"
              fullWidth
              required
              autoComplete="off"
              inputRef={inputRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <TagSelector value={selectedTags} onChange={setSelectedTags} />

            <Box
              display="flex"
              gap={1}
              justifyContent="flex-end"
              flexDirection={{ xs: 'column-reverse', sm: 'row' }}
            >
              <Button
                onClick={() => router.back()}
                color="inherit"
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}
