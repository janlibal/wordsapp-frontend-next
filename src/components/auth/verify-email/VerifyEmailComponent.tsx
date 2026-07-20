'use client'

import { useConfirmEmail } from '@/src/hooks/mutations/auth/useConfirmEmailHook'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Fade,
  Paper,
  Typography,
} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useVerifyEmail } from '@/src/hooks/mutations/auth/useVerifyEmailHook'

export default function VerifyEmailComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const hash = searchParams.get('hash')

  const { mutate, isPending, isSuccess, isError } = useVerifyEmail()

  const called = useRef(false)

  useEffect(() => {
    if (!hash || called.current) return

    called.current = true
    mutate({ hash })
  }, [hash, mutate])

  return (
    <Fade in timeout={400}>
      <Paper
        sx={{
          p: 5,
          width: '100%',
          maxWidth: 480,
          mx: 'auto',
          textAlign: 'center',
        }}
      >
        {isPending && (
          <>
            <CircularProgress />

            <Typography variant="h5" mt={3} mb={1}>
              Verifying your email...
            </Typography>

            <Typography color="text.secondary">
              Please wait while we verify your email.
            </Typography>
          </>
        )}

        {isSuccess && (
          <>
            <CheckCircleOutlineIcon
              color="success"
              sx={{ fontSize: 72, mb: 2 }}
            />

            <Typography variant="h5" fontWeight={700} gutterBottom>
              Email confirmed!
            </Typography>

            <Typography color="text.secondary" mb={4}>
              You're now on the waiting list. We'll notify you when access
              becomes available.
            </Typography>
          </>
        )}

        {isError && (
          <>
            <ErrorOutlineIcon color="error" sx={{ fontSize: 72, mb: 2 }} />

            <Typography variant="h5" fontWeight={700} gutterBottom>
              Confirmation failed
            </Typography>

            <Alert severity="error" sx={{ mb: 3 }}>
              This confirmation link is invalid or has expired.
            </Alert>

            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/login')}
            >
              Back to Login
            </Button>
          </>
        )}
      </Paper>
    </Fade>
  )
}
