'use client'

import { Box, Button, Paper, Stack, Typography } from '@mui/material'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        sx={{
          width: '100%',
          maxWidth: 480,
          p: { xs: 3, sm: 4 },
          textAlign: 'center',
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h5">Something went wrong</Typography>

          <Typography color="text.secondary">
            An unexpected error occurred.
          </Typography>

          <Button variant="contained" onClick={() => reset()}>
            Try again
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
