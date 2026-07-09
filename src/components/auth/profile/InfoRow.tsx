import { Box, Typography } from '@mui/material'

type Props = {
  label: string
  value: string
}

export function InfoRow({ label, value }: Props) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>

      <Typography variant="body1">{value}</Typography>
    </Box>
  )
}

export function InfoRow1({ label, value }: Props) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>

      <Typography variant="body1">{value}</Typography>
    </Box>
  )
}
