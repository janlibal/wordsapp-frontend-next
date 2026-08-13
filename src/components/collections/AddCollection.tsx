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
import { useRouter, useSearchParams } from 'next/navigation'
import { Tag } from '@/src/types/tags/tag.type'
import { getTags } from '@/src/services/tags/tag.service'
import Autocomplete from '@mui/material/Autocomplete'
import TagSelector from '../tags/TagSelector'
import useCreateWord from '@/src/hooks/mutations/useCreateWordHook'
import { useSnackbar } from '@/src/hooks/SnacbarProvider'
import { useCreateCollection } from '@/src/hooks/mutations/useCreateCollectionHook'

export default function AddCollection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [name, setName] = useState('')

  const inputRef = useRef<HTMLInputElement | null>(null)

  const createMutation = useCreateCollection()

  const showSnackbar = useSnackbar()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      return
    }

    createMutation.mutate(
      { name },
      {
        onSuccess: () => {
          showSnackbar({
            message: 'Collection created',
          })
          const params = searchParams.toString()
          router.push(params ? `/?${params}` : '/')
        },

        onError: (err: any) => {
          showSnackbar({
            message: err.message || 'Failed to create collection',
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
          Create new collection
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Give your collection a name
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              label="Collection"
              fullWidth
              required
              autoComplete="off"
              inputRef={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

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
                disabled={createMutation.isPending}
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                {createMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}
