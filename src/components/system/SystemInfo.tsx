import { Box, Typography } from '@mui/material'
import { AppInfo } from '../../types/app.info.response'

type Props = {
  data: AppInfo
}

export default function SystemInfo({ data }: Props) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h4">System Info</Typography>

      <Typography>Name: {data.name}</Typography>
      <Typography>Version: {data.version}</Typography>
      <Typography>Description: {data.description}</Typography>

      <Typography mt={2} variant="h6">
        Environment
      </Typography>
      <Typography>Node: {data.env.nodeVersion}</Typography>
      <Typography>Host: {data.env.hostName}</Typography>
      <Typography>Platform: {data.env.platform}</Typography>
    </Box>
  )
}
