import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  IconButton,
  Button,
  Chip,
  Autocomplete,
  Stack,
  MenuItem,
  Menu,
  Snackbar,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Tag } from '@/src/types/tags/tag.type'
import { useUpdateWord } from '@/src/hooks/useUpdateHook'
import { getTags } from '@/src/services/tags/tag.service'

import MoreVertIcon from '@mui/icons-material/MoreVert'

import {
  addTagToWord,
  deleteWord,
  removeTagFromWord,
} from '@/src/services/words/word.service'
import WordActionsMenu from './WordActionsMenu'
import { Word } from '@/src/types/words/word.type'

type WordCardProps = {
  id: string
  content: string
  tags: Tag[]
  search?: string
}

export default function WordCard({ id, content, tags, search }: WordCardProps) {
  const [editing, setEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags)
  const [isSaving, setIsSaving] = useState(false)
  const [hovered, setHovered] = useState(false)

  const [deletedWord, setDeletedWord] = useState<Word | null>(null)
  const [showUndo, setShowUndo] = useState(false)

  const queryClient = useQueryClient()

  // 🧠 MOCK delete (no backend yet)
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return true
    },
  })

  const mutation = useUpdateWord()

  const { data: allTags = [] } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: () => getTags(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    setSelectedTags(tags)
  }, [tags])

  // 💾 save
  const handleSave = () => {
    setIsSaving(true)

    mutation.mutate(
      {
        id,
        data: { content: editedContent },
      },
      {
        onSettled: () => {
          setIsSaving(false)
          setEditing(false)
        },
      }
    )
  }

  // 🏷 tag update
  const handleTagChange = async (newTags: Tag[]) => {
    const added = newTags.filter(
      (t) => !selectedTags.some((st) => st.id === t.id)
    )

    const removed = selectedTags.filter(
      (t) => !newTags.some((nt) => nt.id === t.id)
    )

    setSelectedTags(newTags)

    await Promise.all([
      ...added.map((t) => addTagToWord(id, t.id)),
      ...removed.map((t) => removeTagFromWord(id, t.id)),
    ])
  }

  // 🗑 DELETE (optimistic, safe)
  const handleDelete = () => {
    const currentWords = queryClient.getQueryData<Word[]>(['words']) || []

    const wordToDelete = currentWords.find((w) => w.id === id)
    if (!wordToDelete) return

    // remove instantly
    queryClient.setQueryData(
      ['words'],
      currentWords.filter((w) => w.id !== id)
    )

    setDeletedWord(wordToDelete)
    setShowUndo(true)

    // delay actual delete
    setTimeout(() => {
      deleteMutation.mutate(id)
    }, 3000)
  }

  // ↩ undo
  const handleUndo = () => {
    if (!deletedWord) return

    queryClient.setQueryData(['words'], (old: Word[] = []) => [
      deletedWord,
      ...old,
    ])

    setDeletedWord(null)
    setShowUndo(false)
  }

  // 🎯 actions menu (clean)
  const { handleOpen, Menu: ActionsMenu } = WordActionsMenu({
    onEdit: () => setEditing(true),
    onDelete: handleDelete,
    onFavorite: () => alert('TODO favorite'),
  })

  // 🔍 highlight
  const highlightText = (text: string, query?: string) => {
    if (!query) return text

    const words = query.trim().split(/\s+/)
    const regex = new RegExp(`(${words.join('|')})`, 'gi')

    return text
      .split(regex)
      .map((part, i) =>
        words.some((w) => w.toLowerCase() === part.toLowerCase()) ? (
          <mark key={i}>{part}</mark>
        ) : (
          part
        )
      )
  }

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        borderRadius: 3,
        mb: 2,
        transition: '0.2s',
        '&:hover': { boxShadow: 4 },
      }}
    >
      <CardContent>
        <Stack spacing={1.5}>
          {/* TOP */}
          <Box display="flex" justifyContent="space-between">
            {editing ? (
              <TextField
                fullWidth
                multiline
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
            ) : (
              <Typography sx={{ flex: 1 }}>
                {highlightText(content, search)}
              </Typography>
            )}

            {hovered && !editing && (
              <IconButton size="small" onClick={handleOpen}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          {/* ✅ MENU (only ONE!) */}
          {ActionsMenu}

          {/* TAGS */}
          {!editing && (
            <Box display="flex" alignItems="center" gap={1}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {tags.map((t) => (
                  <Chip key={t.id} label={t.name} size="small" />
                ))}
              </Stack>

              <Chip size="small" label={tags.length} />
            </Box>
          )}

          {/* EDIT */}
          {editing && (
            <>
              <Autocomplete
                multiple
                options={allTags}
                value={selectedTags}
                onChange={(_, v) => handleTagChange(v)}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                getOptionLabel={(o) => o.name}
                renderInput={(params) => <TextField {...params} label="Tags" />}
              />

              <Box display="flex" gap={1}>
                <Button onClick={handleSave} variant="contained">
                  Save
                </Button>

                {isSaving && <Typography variant="body2">Saving...</Typography>}
              </Box>
            </>
          )}
        </Stack>
      </CardContent>

      {/* SNACKBAR */}
      <Snackbar
        open={showUndo}
        autoHideDuration={3000}
        onClose={() => setShowUndo(false)}
        message="Word deleted"
        action={
          <Button onClick={handleUndo} size="small">
            UNDO
          </Button>
        }
      />
    </Card>
  )
}
