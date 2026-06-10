'use client'

import { Tag } from '@/src/types/tags/tag.type'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { useEffect, useState } from 'react'
import { useUpdateTag } from '@/src/hooks/mutations/useUpdateTagHook'
import { useSnackbar } from '@/src/hooks/SnacbarProvider'
import { Collection } from '@/src/types/collections/collections.type'

type Props = {
  collection: Collection
}

export default function CollectionCard({ collection }: Props) {
  const showSnackbar = useSnackbar()

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box flex={1}>
            <Typography variant="body1">{collection.name}</Typography>
            <Chip size="small" label={`${collection.count} words`} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
