import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  IconButton,
  Button,
  Chip,
  Stack,
  Snackbar,
  Fade,
  Collapse,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Tag } from '@/src/types/tags/tag.type'
import { useUpdateWord } from '@/src/hooks/useUpdateHook'
import { getTags } from '@/src/services/tags/tag.service'
import { motion } from 'framer-motion'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import {
  addTagToWord,
  removeTagFromWord,
} from '@/src/services/words/word.service'
import WordActionsMenu from './WordActionsMenu'
import { Word } from '@/src/types/words/word.type'
import TagSelector from '../tags/TagSelector'
import { useDeleteWord } from '@/src/hooks/useDeleteHook'
import { highlightText } from '@/src/helpers/highlightText'
import { useSnackbar } from '@/src/hooks/SnacbarProvider'
import { useRestoreWord } from '@/src/hooks/useRestoreHook'

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
  const [hovered, setHovered] = useState(false)

  const updateMutation = useUpdateWord()
  updateMutation.isPending
  const deleteMutation = useDeleteWord()
  const restoreMutation = useRestoreWord()
  const showSnackbar = useSnackbar()

  /*const { data: allTags = [] } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: () => getTags(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })*/

  useEffect(() => {
    setSelectedTags(tags)
  }, [tags])

  const handleDelete = () => {
    const deletedWord: Word = {
      id,
      content,
      tags,
    }

    showSnackbar({
      message: 'Word deleted',

      action: (
        <Button
          color="secondary"
          size="small"
          onClick={() => {
            restoreMutation.mutate(deletedWord, {
              onSuccess: () => {
                showSnackbar({
                  message: 'Word restored',
                })
              },

              onError: () => {
                showSnackbar({
                  message: 'Restore failed',
                })
              },
            })
          }}
        >
          UNDO
        </Button>
      ),
    })

    deleteMutation.mutate(id, {
      onError: () => {
        showSnackbar({
          message: 'Delete failed',
        })
      },
    })
  }

  // 💾 save
  const handleSave = () => {
    updateMutation.mutate(
      { id, data: { content: editedContent } },
      {
        onSuccess: () => {
          showSnackbar({ message: 'Word updated' })
          setEditing(false)
        },
        onError: () => showSnackbar({ message: 'Update failed' }),
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

  // 🎯 actions menu (clean)
  const { handleOpen, Menu: ActionsMenu } = WordActionsMenu({
    onEdit: () => setEditing(true),
    onDelete: handleDelete,
    onFavorite: () => alert('TODO favorite'),
  })

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        borderRadius: 3,
        mb: 2,
        transition: '0.2s',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          boxShadow: 3,
          borderColor: 'primary.light',
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          {/* TOP */}
          <Box display="flex" alignItems="flex-start" gap={1}>
            <Box flex={1}>
              {editing ? (
                <TextField
                  fullWidth
                  multiline
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              ) : (
                <Typography sx={{ lineHeight: 1.6 }}>
                  {highlightText(content, search)}
                </Typography>
              )}
            </Box>

            {hovered && !editing && (
              <Fade in={!editing}>
                <IconButton size="small" onClick={handleOpen}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Fade>
            )}
          </Box>

          {ActionsMenu}

          {/* TAGS */}
          <Collapse in={!editing}>
            <Fade in={!editing}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {tags.map((t) => (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Chip label={t.name} size="small" variant="outlined" />
                  </motion.div>
                ))}

                {tags.length > 0 && <Chip size="small" label={tags.length} />}
              </Stack>
            </Fade>
          </Collapse>

          {/* EDIT MODE */}
          <Collapse in={editing}>
            <Fade in={editing}>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <TagSelector value={selectedTags} onChange={handleTagChange} />

                <Box display="flex" gap={1} justifyContent="flex-end">
                  <Button
                    size="small"
                    onClick={() => {
                      setEditing(false)
                      setEditedContent(content)
                      setSelectedTags(tags)
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? 'Saving...' : 'Save'}
                  </Button>
                </Box>
              </Stack>
            </Fade>
          </Collapse>
        </Stack>
      </CardContent>
      {/* SNACKBAR */}
    </Card>
  )
}
