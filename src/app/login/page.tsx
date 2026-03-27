'use client'

import { useEffect, useState } from 'react'
import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/authContext'
import { login } from '@/src/lib/api/auth'

export default function LoginPage() {
  const router = useRouter()
  const { loginUser, token } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 🚫 Prevent logged-in users from seeing login page

  useEffect(() => {
    if (token) {
      router.push('/')
    }
  }, [token, router])

  /*const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await login(email, password)

      loginUser(data.access_token)

      router.push('/')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }*/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    try {
      // 🧪 FAKE LOGIN
      const fakeToken = 'fake-jwt-token-123'

      loginUser(fakeToken)

      router.push('/')
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2, // 👈 horizontal padding for small screens
      }}
    >
      <Paper
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400, // 👈 responsive instead of fixed width
        }}
      >
        <Typography variant="h5" mb={2} textAlign="center">
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Paper>
    </Box>
  )
}
