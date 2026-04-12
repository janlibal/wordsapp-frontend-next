'use client'

import { useState } from 'react'
import { Box, TextField, Button, Chip, Stack } from '@mui/material'
import { useRouter } from 'next/navigation'
import { createWord } from '@/src/services/words/word.service'
import { useQueryClient } from '@tanstack/react-query'

export default function AddWord() {
  const router = useRouter()

  const [content, setContent] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const addTag = () => {
    if (!tagInput.trim()) return
    setTags((prev) => [...prev, tagInput.trim()])
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await createWord({
        content,
        tags,
      })

      queryClient.invalidateQueries({ queryKey: ['words'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      queryClient.refetchQueries({ queryKey: ['tags'] })

      router.push('/') // redirect after success
    } catch (err: any) {
      setError(err.message || 'Failed to create word')
    } finally {
      setLoading(false)
    }
  }

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
      <h2>Add new word / phrase</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Word / Phrase"
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {/* TAG INPUT */}
        <Box mt={2}>
          <TextField
            label="Add tag"
            fullWidth
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTag()
              }
            }}
          />
          <Button onClick={addTag} sx={{ mt: 1 }}>
            Add tag
          </Button>
        </Box>

        {/* TAG LIST */}
        <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
          {tags.map((tag) => (
            <Chip key={tag} label={tag} onDelete={() => removeTag(tag)} />
          ))}
        </Stack>

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
