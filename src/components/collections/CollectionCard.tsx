import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Fade,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import FolderIcon from '@mui/icons-material/Folder'
import { useTheme } from '@mui/material/styles'
import { Collection } from '@/src/types/collections/collections.type'
import CollectionActionsMenu from './CollectionActionsMenu'
import { useSnackbar } from '@/src/hooks/SnacbarProvider'
import { useUpdateCollection } from '@/src/hooks/mutations/useUpdateCollectionHook'
import { useDeleteCollection } from '@/src/hooks/mutations/useDeleteCollectionHook'
import { useRouter } from 'next/navigation'

type Props = {
  collection: Collection
}

export default function CollectionCard({ collection }: Props) {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editedCollection, setEditedCollection] = useState(collection.name)
  const showSnackbar = useSnackbar()

  const updateMutation = useUpdateCollection()
  updateMutation.isPending
  const deleteMutation = useDeleteCollection()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleSave = () => {
    updateMutation.mutate(
      { id: collection.id, data: { name: editedCollection } },
      {
        onSuccess: () => {
          showSnackbar({ message: 'Collection updated' })
          setEditing(false)
        },
        onError: () => showSnackbar({ message: 'Update failed' }),
      }
    )
  }

  const handleDelete = () => {
    deleteMutation.mutate(collection.id, {
      onError: () => {
        showSnackbar({
          message: 'Delete failed',
        })
      },
    })
  }

  const handleView = useCallback(() => {
    router.push(`/?collectionId=${collection.id}`)
  }, [router, collection.id])

  const { handleOpen, Menu: ActionsMenu } = CollectionActionsMenu({
    onEdit: () => setEditing(true),
    onDelete: handleDelete,
    deleteDisabled: (collection.count ?? 0) > 0,
    onView: () => handleView(),
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
        borderColor: hovered ? 'primary.light' : 'divider',

        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          {/* TOP */}
          <Box display="flex" alignItems="flex-start" gap={1}>
            <Box flex={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <FolderIcon
                  color="primary"
                  fontSize={isMobile ? 'medium' : 'small'}
                />

                {editing ? (
                  <TextField
                    fullWidth
                    size="small"
                    value={editedCollection}
                    onChange={(e) => setEditedCollection(e.target.value)}
                  />
                ) : (
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{ lineHeight: 1.6 }}
                  >
                    {collection.name}
                  </Typography>
                )}
              </Stack>

              {!editing && (
                <Box mt={1}>
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`${collection.count ?? 0} words`}
                  />
                </Box>
              )}
            </Box>

            {!editing && (
              <IconButton
                size={isMobile ? 'medium' : 'small'}
                onClick={handleOpen}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          {ActionsMenu}

          {/* EDIT MODE */}
          <Collapse in={editing}>
            <Fade in={editing}>
              <Stack spacing={2}>
                <Box
                  display="flex"
                  gap={1}
                  justifyContent="flex-end"
                  flexDirection={{ xs: 'column-reverse', sm: 'row' }}
                >
                  <Button
                    size="small"
                    onClick={() => {
                      setEditing(false)
                      setEditedCollection(collection.name)
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
