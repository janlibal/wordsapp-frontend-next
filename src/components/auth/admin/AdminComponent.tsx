'use client'

import { Alert, CircularProgress, Stack, Typography } from '@mui/material'

import PendingUserCard from './PendingUserCard'
import { PageContainer } from '@/src/ui/pageContainer'
import usePendingUsers from '@/src/hooks/queries/usePendingUsers'

export function AdminComponent() {
  const { data: users, isLoading, isError } = usePendingUsers()

  const handleApprove = (id: string) => {
    console.log('Approve', id)

    // later:
    // approveMutation.mutate(id)
  }

  if (isLoading) {
    return (
      <PageContainer>
        <CircularProgress />
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer>
        <Alert severity="error">Failed to load pending users.</Alert>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Typography variant="h4" gutterBottom>
        Pending approvals
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={4}>
        Users waiting for access to the application.
      </Typography>

      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        {users?.length ?? 0} pending users
      </Typography>

      <Stack spacing={2}>
        {users?.length ? (
          users.map((user) => (
            <PendingUserCard
              key={user.id}
              user={user}
              onApprove={handleApprove}
            />
          ))
        ) : (
          <Alert severity="info">
            There are currently no users waiting for approval.
          </Alert>
        )}
      </Stack>
    </PageContainer>
  )
}
