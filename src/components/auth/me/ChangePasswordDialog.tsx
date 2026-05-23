'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useSnackbar } from '@/src/hooks/SnacbarProvider'
import { useChangePassword } from '@/src/hooks/mutations/auth/useChangePasswordHook'

type Props = {
  open: boolean
  onClose: () => void
}

const MIN_PASSWORD_LENGTH = 8

export default function ChangePasswordDialog({ open, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const changeMutation = useChangePassword()
  const showSnackbar = useSnackbar()

  const theme = useTheme()

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [currentPassword, setCurrentPassword] = useState('')

  const [newPassword, setNewPassword] = useState('')

  const [confirmPassword, setConfirmPassword] = useState('')

  const [showCurrent, setShowCurrent] = useState(false)

  const [showNew, setShowNew] = useState(false)

  const [showConfirm, setShowConfirm] = useState(false)

  // VALIDATION

  const passwordTooShort =
    newPassword.length > 0 && newPassword.length < MIN_PASSWORD_LENGTH

  const passwordsDoNotMatch =
    confirmPassword.length > 0 && confirmPassword !== newPassword

  const isFormValid = useMemo(() => {
    return (
      currentPassword.length > 0 &&
      newPassword.length >= MIN_PASSWORD_LENGTH &&
      confirmPassword === newPassword
    )
  }, [currentPassword, newPassword, confirmPassword])

  const resetForm = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')

    setShowCurrent(false)
    setShowNew(false)
    setShowConfirm(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = () => {
    if (!isFormValid) return

    changeMutation.mutate(
      {
        currentPassword,
        newPassword,
      },
      {
        onSuccess: () => {
          showSnackbar({
            message: 'Password changed successfully',
          })

          handleClose()
        },

        onError: (err: any) => {
          showSnackbar({
            message: err.message || 'Failed to change password',
          })
        },
      }
    )
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      TransitionProps={{
        onEntered: () => {
          inputRef.current?.focus()
        },
      }}
    >
      <DialogTitle>Change Password</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Your new password must be at least 8 characters long.
          </Typography>

          {/* CURRENT PASSWORD */}

          <TextField
            label="Current Password"
            type={showCurrent ? 'text' : 'password'}
            fullWidth
            inputRef={inputRef}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowCurrent(!showCurrent)}
                    edge="end"
                  >
                    {showCurrent ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* NEW PASSWORD */}

          <Stack spacing={1}>
            <TextField
              label="New Password"
              type={showNew ? 'text' : 'password'}
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              error={passwordTooShort}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNew(!showNew)} edge="end">
                      {showNew ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {passwordTooShort && (
              <FormHelperText error>
                Password must be at least {MIN_PASSWORD_LENGTH} characters long
              </FormHelperText>
            )}
          </Stack>

          {/* CONFIRM PASSWORD */}

          <Stack spacing={1}>
            <TextField
              label="Confirm New Password"
              type={showConfirm ? 'text' : 'password'}
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              error={passwordsDoNotMatch}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirm(!showConfirm)}
                      edge="end"
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {passwordsDoNotMatch && (
              <FormHelperText error>Passwords do not match</FormHelperText>
            )}
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
        }}
      >
        <Button onClick={handleClose} disabled={changeMutation.isPending}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={changeMutation.isPending}
        >
          {changeMutation.isPending ? 'Saving...' : 'Save Password'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
