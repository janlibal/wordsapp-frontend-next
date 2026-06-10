'use client'

import useCollections from '@/src/hooks/queries/useCollections'
import { PageContainer } from '@/src/ui/pageContainer'
import AddIcon from '@mui/icons-material/Add'
import Link from 'next/link'
import { Card, CardContent, Stack, Typography } from '@mui/material'
import CollectionCard from './CollectionCard'

export default function CollectionsList() {
  const { data: collections = [], isLoading } = useCollections()

  return (
    <PageContainer>
      <Stack spacing={2}>
        <Card
          component={Link}
          href="/collections/new"
          sx={{
            textDecoration: 'none',
            borderRadius: 3,
            border: '1px dashed',
            borderColor: 'primary.main',
            cursor: 'pointer',
            transition: '0.2s',

            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <AddIcon color="primary" />

              <Typography color="primary" fontWeight={600}>
                New Collection
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {isLoading && <Typography>Loading collections...</Typography>}

        {!collections.length && !isLoading && (
          <Typography color="text.secondary">No collections yet</Typography>
        )}

        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </Stack>
    </PageContainer>
  )
}

export function CollectionsList1() {
  const { data: collections = [], isLoading } = useCollections()

  return (
    <PageContainer>
      <Stack spacing={2}>
        {isLoading && <Typography>Loading collections...</Typography>}

        {!collections.length && !isLoading && (
          <Typography color="text.secondary">No collections yet</Typography>
        )}

        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </Stack>
    </PageContainer>
  )
}
