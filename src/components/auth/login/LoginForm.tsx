'use client'

import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  Fade,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/src/app/context/authContext'
import { login } from '@/src/services/auth/auth.service'

export default function LoginForm() {
  const router = useRouter()
  const { refreshAuth } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const emailRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const validate = () => {
    if (!email.includes('@')) return 'Invalid email'
    if (password.length < 6) return 'Password must be at least 6 characters'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setLoading(true)

    try {
      await login({ email, password })
      await refreshAuth()
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Fade in timeout={400}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Login
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            inputRef={emailRef}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((s) => !s)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        {/* 🔁 SWITCH */}
        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
          Don’t have an account?{' '}
          <Button size="small" onClick={() => router.push('/register')}>
            Sign up
          </Button>
        </Typography>
      </Paper>
    </Fade>
  )
}
