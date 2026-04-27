'use client'

import { useEffect, useRef, useState } from 'react'
import { Box, TextField, Button, Chip, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { createWord } from '@/src/services/words/word.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Tag } from '@/src/types/tags/tag.type'
import { getTags } from '@/src/services/tags/tag.service'
import Autocomplete from '@mui/material/Autocomplete'

export default function AddWord() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement | null>(null)

  // ✅ fetch existing tags
  const { data: allTags = [] } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: () => getTags(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

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
        <Autocomplete
          multiple
          freeSolo
          options={allTags}
          value={selectedTags}
          onChange={(_, newValue) => {
            const mapped = newValue.map((item) => {
              if (typeof item === 'string') {
                return { id: item, name: item, count: 0 }
              }

              if ((item as any).inputValue) {
                return {
                  id: (item as any).inputValue,
                  name: (item as any).inputValue,
                  count: 0,
                }
              }

              return item
            })

            // ✅ prevent duplicates
            const unique = Array.from(
              new Map(mapped.map((t) => [t.name.toLowerCase(), t])).values()
            )

            setSelectedTags(unique)
          }}
          isOptionEqualToValue={(a, b) => a.id === b.id}
          getOptionLabel={(option) => {
            if (typeof option === 'string') return option
            return option.name
          }}
          filterOptions={(options, params) => {
            const filtered = options.filter((o) =>
              o.name.toLowerCase().includes(params.inputValue.toLowerCase())
            )

            if (params.inputValue !== '') {
              filtered.push({
                id: params.inputValue,
                name: `Add "${params.inputValue}"`,
                count: 0,
                inputValue: params.inputValue,
              } as any)
            }

            return filtered
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index })

              return <Chip key={key} label={option.name} {...tagProps} />
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tags"
              placeholder="Type or select tags"
              sx={{ mt: 2 }}
            />
          )}
        />

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
