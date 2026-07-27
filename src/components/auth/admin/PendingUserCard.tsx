'use client'

import { User } from '@/src/types/auth/auth.types'
import { AppCard } from '@/src/ui/appCard'
import { Avatar, Box, Chip, Divider, Stack, Typography } from '@mui/material'
import PendingUserActionsMenu from './PendinUserActionsMenu'

type Props = {
  user: User
  onApprove?: (id: string) => void
}

export default function PendingUserCard({ user, onApprove }: Props) {
  return (
    <AppCard>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar>
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </Avatar>

          <Box flex={1}>
            <Typography variant="h6">
              {user.firstName} {user.lastName}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>

          <PendingUserActionsMenu user={user} disabled={false} />
        </Stack>

        <Divider />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {user.emailVerified ? (
            <Chip label="Email verified" color="success" size="small" />
          ) : (
            <Chip
              label="Waiting for verification"
              color="warning"
              size="small"
            />
          )}

          <Typography variant="body2" color="text.secondary">
            Joined{' '}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : '-'}
          </Typography>
        </Stack>
      </Stack>
    </AppCard>
  )
}
