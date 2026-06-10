import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import FolderIcon from '@mui/icons-material/Folder'
import { useTheme } from '@mui/material/styles'
import { Collection } from '@/src/types/collections/collections.type'
import CollectionActionsMenu from './CollectionActionsMenu'

type Props = {
  collection: Collection
}

export default function CollectionCard({ collection }: Props) {
  const [hovered, setHovered] = useState(false)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const { handleOpen, Menu: ActionsMenu } = CollectionActionsMenu({
    onEdit: () => alert('TODO edit'),
    onDelete: () => alert('TODO delete'),
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
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <FolderIcon
                  color="primary"
                  fontSize={isMobile ? 'medium' : 'small'}
                />

                <Typography variant="body1" fontWeight={500}>
                  {collection.name}
                </Typography>
              </Stack>

              <Chip
                size="small"
                variant="outlined"
                label={`${collection.count ?? 0} words`}
              />
            </Box>

            <IconButton
              size={isMobile ? 'medium' : 'small'}
              onClick={handleOpen}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>

          {ActionsMenu}
        </Stack>
      </CardContent>
    </Card>
  )
}
