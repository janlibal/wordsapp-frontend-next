import { Box, Divider, Stack, Typography } from '@mui/material'
import { PageContainer } from '@/src/ui/pageContainer'
import { AppCard } from '@/src/ui/appCard'
import { SystemInfo } from '../../types/app/app.types'

type Props = {
  data: SystemInfo
}

export default function SystemInfoComponent({ data }: Props) {
  return (
    <PageContainer>
      <AppCard>
        <Stack spacing={3}>
          {/* Title */}
          <Typography variant="h5" fontWeight={600} textAlign="center">
            System Info
          </Typography>

          <Divider />

          {/* App info */}
          <Stack spacing={1}>
            <Typography variant="body1">
              <strong>Name:</strong> {data.name}
            </Typography>

            <Typography variant="body1">
              <strong>Version:</strong> {data.version}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {data.description}
            </Typography>
          </Stack>

          <Divider />

          {/* Environment */}
          <Stack spacing={1}>
            <Typography variant="h6">Environment</Typography>

            <Typography variant="body2">
              <strong>Node:</strong> {data.env.nodeVersion}
            </Typography>

            <Typography variant="body2">
              <strong>Host:</strong> {data.env.hostName}
            </Typography>

            <Typography variant="body2">
              <strong>Platform:</strong> {data.env.platform}
            </Typography>
          </Stack>
        </Stack>
      </AppCard>
    </PageContainer>
  )
}
