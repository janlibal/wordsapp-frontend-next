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
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Tag } from '@/src/types/tags/tag.type'
import { useUpdateWord } from '@/src/hooks/mutations/useUpdateWordHook'
import { getTags } from '@/src/services/tags/tag.service'
import { motion } from 'framer-motion'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import StarIcon from '@mui/icons-material/Star'
import FolderIcon from '@mui/icons-material/Folder'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { useTheme, useMediaQuery } from '@mui/material'

import {
  addTagToWord,
  removeTagFromWord,
} from '@/src/services/words/word.service'
import WordActionsMenu from './WordActionsMenu'
import { Word } from '@/src/types/words/word.type'
import TagSelector from '../tags/TagSelector'
import { useDeleteWord } from '@/src/hooks/mutations/useDeleteWordHook'
import { highlightText } from '@/src/helpers/highlightText'
import { useSnackbar } from '@/src/hooks/SnacbarProvider'
import { useRestoreWord } from '@/src/hooks/mutations/useRestoreWordHook'
import useCollections from '@/src/hooks/queries/useCollections'
import { Collection } from '@/src/types/collections/collections.type'

type WordCardProps = {
  id: Word['id']
  content: Word['content']
  tags: Tag[]
  favorite: Word['favorite']
  search?: string
  createdAt: Word['createdAt']
  updatedAt: Word['updatedAt']
  collectionId?: Word['collectionId']
  collection?: {
    id: Collection['id']
    name: Collection['name']
  }
}

export default function WordCard({
  id,
  content,
  tags,
  search,
  favorite,
  collection,
  collectionId,
  createdAt,
  updatedAt,
}: WordCardProps) {
  const [editing, setEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags)
  //const [hovered, setHovered] = useState(false)
  //const [selectedCollectionId, setSelectedCollectionId] = useState(collectionId ?? '')
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(collection?.id ?? null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const { data: collections = [] } = useCollections()

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

  /*useEffect(() => {
    ;(setSelectedTags(tags), setSelectedCollectionId(collectionId ?? ''))
  }, [tags, collectionId])*/
  useEffect(() => {
    setSelectedTags(tags)
    setSelectedCollectionId(collectionId ?? null)
  }, [tags, collectionId])

  const handleCollectionChange = (value: string) => {
    setSelectedCollectionId(value)
  }

  const handleToggleFavorite = () => {
    updateMutation.mutate(
      {
        id,
        data: {
          favorite: !favorite,
        },
      },
      {
        onSuccess: () => {
          showSnackbar({
            message: !favorite
              ? 'Added to favorites'
              : 'Removed from favorites',
          })
        },
        onError: () => {
          showSnackbar({
            message: 'Favorite update failed',
          })
        },
      }
    )
  }

  const handleDelete = () => {
    const deletedWord: Word = {
      id,
      content,
      favorite,
      tags,
      updatedAt,
      createdAt,
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
      {
        id,
        data: {
          content: editedContent,
          collectionId: selectedCollectionId || undefined,
        },
      },
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
  /*const { handleOpen, Menu: ActionsMenu } = WordActionsMenu({
    onEdit: () => setEditing(true),
    onDelete: handleDelete,
  })*/
  const { handleOpen, Menu: ActionsMenu } = WordActionsMenu({
    onEdit: () => {
      setEditedContent(content)
      setSelectedTags(tags)
      setSelectedCollectionId(collection?.id ?? null)
      setEditing(true)
    },
    onDelete: handleDelete,
  })

  return (
    <Card
      sx={{
        width: '100%',
        minWidth: 0,
        borderRadius: 3,
        mb: 2,
        overflow: 'hidden',

        transition: '0.2s',
        border: '1px solid',
        borderColor: favorite ? 'warning.main' : 'divider',
        backgroundColor: favorite
          ? 'rgba(255, 193, 7, 0.04)'
          : 'background.paper',
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
                <>
                  <Typography
                    sx={{
                      lineHeight: 1.6,
                      overflowWrap: 'anywhere',
                      wordBreak: 'break-word',
                    }}
                  >
                    {highlightText(content, search)}
                  </Typography>

                  {collection && (
                    <Chip
                      icon={<FolderIcon />}
                      label={collection.name}
                      size="small"
                      variant="outlined"
                      sx={{
                        mt: 1,
                        width: 'fit-content',
                      }}
                    />
                  )}
                </>
              )}
            </Box>

            {!editing && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <IconButton
                  size={isMobile ? 'medium' : 'small'}
                  aria-label={
                    favorite ? 'Remove from favorites' : 'Add to favorites'
                  }
                  onClick={handleToggleFavorite}
                >
                  {favorite ? (
                    <StarIcon
                      color="warning"
                      fontSize={isMobile ? 'medium' : 'small'}
                    />
                  ) : (
                    <StarBorderIcon
                      color="warning"
                      fontSize={isMobile ? 'medium' : 'small'}
                    />
                  )}
                </IconButton>

                <IconButton
                  size={isMobile ? 'medium' : 'small'}
                  onClick={handleOpen}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Stack>
            )}
          </Box>

          {ActionsMenu}

          {/* TAGS */}
          <Collapse in={!editing}>
            <Fade in={!editing}>
              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                flexWrap="wrap"
                sx={{
                  minWidth: 0,
                }}
              >
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
                <FormControl fullWidth size="small">
                  <InputLabel>Collection</InputLabel>

                  <Select
                    value={selectedCollectionId ?? ''}
                    onChange={(e) => setSelectedCollectionId(e.target.value)}
                  >
                    <MenuItem value="">None</MenuItem>

                    {collections.map((collection) => (
                      <MenuItem key={collection.id} value={collection.id}>
                        {collection.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box display="flex" gap={1} justifyContent="flex-end">
                  <Button
                    size="small"
                    onClick={() => {
                      setEditing(false)
                      setEditedContent(content)
                      setSelectedTags(tags)
                      setSelectedCollectionId(collection?.id ?? null)
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
    </Card>
  )
}
