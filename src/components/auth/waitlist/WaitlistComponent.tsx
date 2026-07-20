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
import { join } from '@/src/services/auth/auth.service'

export default function WaitlistComponent() {
  const router = useRouter()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const firstNameRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    firstNameRef.current?.focus()
  }, [])

  const validate = () => {
    if (!email.includes('@')) return 'Invalid email'
    //if (password.length < 6) return 'Password must be at least 6 characters'
    if (!firstName.trim()) return 'First name is required'
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
      await join({
        firstName,
        lastName,
        email,
      })

      router.push('/login')
    } catch (err: any) {
      setError(err.message || 'Adding failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Fade in timeout={400}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Add to waitlist
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            fullWidth
            margin="normal"
            inputRef={firstNameRef}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <TextField
            label="Last Name"
            fullWidth
            margin="normal"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Adding to waitlist...' : 'Add'}
          </Button>
        </form>

        {/* 🔁 SWITCH */}
        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Button size="small" onClick={() => router.push('/login')}>
            Login
          </Button>
        </Typography>
      </Paper>
    </Fade>
  )
}
