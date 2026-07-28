'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useCreatePassword } from '@/src/hooks/mutations/admin/useCreatePasswordHook'
import { PageContainer } from '@/src/ui/pageContainer'
import { AppCard } from '@/src/ui/appCard'
import { Visibility, VisibilityOff } from '@mui/icons-material'

export default function CreatePasswordComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const hash = searchParams.get('hash')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setConfirmShowPassword] = useState(false)

  const createPasswordMutation = useCreatePassword()

  const passwordRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    passwordRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError('')

    if (!hash) {
      setError('Invalid invitation link.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      await createPasswordMutation.mutateAsync({
        hash,
        password,
      })

      router.push('/login')
    } catch {
      setError('Unable to create password.')
    }
  }

  return (
    <PageContainer>
      <AppCard>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight={600}>
              Create your password
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Your account has been approved. Create a password to finish
              setting up your account.
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              inputRef={passwordRef}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setConfirmShowPassword((prev) => !prev)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={createPasswordMutation.isPending}
            >
              Create password
            </Button>
          </Stack>
        </Box>
      </AppCard>
    </PageContainer>
  )
}
