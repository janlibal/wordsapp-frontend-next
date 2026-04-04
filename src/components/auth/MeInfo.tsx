import { Box, Typography } from '@mui/material'
import { User } from '@/src/types/auth.types'

type Props = {
  data: User
}

export default function MeInfo({ data }: Props) {
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
      <Typography>
        {data.firstName} {data.lastName}
      </Typography>
      <Typography>{data.email}</Typography>
    </Box>
  )
}
