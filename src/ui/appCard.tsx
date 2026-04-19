import { Paper } from '@mui/material'

export function AppCard({ children }: { children: React.ReactNode }) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        width: '100%',
      }}
    >
      {children}
    </Paper>
  )
}
