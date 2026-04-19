import { User } from '@/src/types/auth/auth.types'
import { AppCard } from '@/src/ui/appCard'
import { PageContainer } from '@/src/ui/pageContainer'
import { Box, Typography, Paper, Stack, Avatar, Divider } from '@mui/material'

type Props = {
  data: User
}

export default function MeInfo({ data }: Props) {
  return (
    <PageContainer>
      <AppCard>
        <Stack spacing={2} alignItems="center">
          <Avatar sx={{ width: 64, height: 64 }} />
          <Typography variant="h5" fontWeight={600}>
            {data.firstName} {data.lastName}
          </Typography>
          <Divider sx={{ width: '100%' }} />
          <Typography variant="body2" color="text.secondary">
            {data.email}
          </Typography>
        </Stack>
      </AppCard>
    </PageContainer>
  )
}
