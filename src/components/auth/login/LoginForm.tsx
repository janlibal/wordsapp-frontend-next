'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Alert,
  Button,
  Fade,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useLogin } from '@/src/hooks/mutations/auth/useLogin'

export default function LoginForm() {
  const router = useRouter()
  const loginMutation = useLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const emailRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const validate = () => {
    if (!email.includes('@')) return 'Invalid email'
    if (!password) return 'Password is required'

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

    try {
      await loginMutation.mutateAsync({
        email,
        password,
      })

      router.push('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials')
    }
  }

  return (
    <Fade in timeout={400}>
      <Paper
        sx={{
          p: { xs: 2.5, sm: 4 },
          width: '100%',
          maxWidth: 400,
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
            inputRef={emailRef}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)

              if (error) {
                setError(null)
              }
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)

              if (error) {
                setError(null)
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((s) => !s)}
                    edge="end"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
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
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
          Want to be in?{' '}
          <Button size="small" onClick={() => router.push('/waitlist')}>
            Add to waitlist
          </Button>
        </Typography>
      </Paper>
    </Fade>
  )
}
