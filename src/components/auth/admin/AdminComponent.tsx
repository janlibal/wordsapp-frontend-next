import { AppCard } from '@/src/ui/appCard'
import { PageContainer } from '@/src/ui/pageContainer'
import { Avatar, Divider, Stack, Typography } from '@mui/material'

export function AdminComponent() {
  return (
    <PageContainer>
      <AppCard>
        <Stack spacing={2} alignItems="center">
          <Avatar sx={{ width: 64, height: 64 }} />
          <Typography variant="h5" fontWeight={600}>
            Admin page
          </Typography>
          <Divider sx={{ width: '100%' }} />
          <Typography variant="body2" color="text.secondary">
            ...the rest is yet to come...
          </Typography>
        </Stack>
      </AppCard>
    </PageContainer>
  )
}
