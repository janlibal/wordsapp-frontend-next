import Link from 'next/link'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'

export default function NotFound() {
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
          <Typography variant="h3">404</Typography>

          <Typography variant="h6">Page not found</Typography>

          <Typography color="text.secondary">
            The page you’re looking for doesn’t exist.
          </Typography>

          <Button component={Link} href="/" variant="contained">
            Go home
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
