// theme.ts
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue primary color
    },
    secondary: {
      main: '#dc004e', // Red secondary color
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
})

export default theme
