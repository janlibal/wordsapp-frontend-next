import { User } from '@/src/types/auth/auth.types'
import { AppCard } from '@/src/ui/appCard'
import { PageContainer } from '@/src/ui/pageContainer'
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  Divider,
  Button,
} from '@mui/material'
import { InfoRow } from './InfoRow'
import { useState } from 'react'
import ChangePasswordDialog from './ChangePasswordDialog'

type Props = {
  data: User
}

export default function Profile({ data }: Props) {
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false)

  return (
    <>
      <PageContainer>
        <Box
          sx={{
            width: '100%',
            maxWidth: 560,
            mx: 'auto',
          }}
        >
          <Stack spacing={3}>
            {/* PROFILE */}
            <AppCard>
              <Stack spacing={2} alignItems="center">
                <Avatar sx={{ width: 72, height: 72 }}>
                  {data.firstName[0]}
                  {data.lastName[0]}
                </Avatar>

                <Box textAlign="center">
                  <Typography variant="h5" fontWeight={700}>
                    {data.firstName} {data.lastName}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {data.email}
                  </Typography>
                </Box>
              </Stack>
            </AppCard>

            {/* SECURITY */}
            <AppCard>
              <Stack spacing={2}>
                <Typography variant="h6">Security</Typography>

                <Divider />

                <InfoRow label="Password" value="••••••••" />

                <Button
                  variant="contained"
                  onClick={() => setOpenPasswordDialog(true)}
                >
                  Change Password
                </Button>
              </Stack>
            </AppCard>
          </Stack>
        </Box>
      </PageContainer>

      <ChangePasswordDialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
      />
    </>
  )
}

export function MeInf1o({ data }: Props) {
  return (
    <PageContainer>
      <Box
        sx={{
          width: '100%',
          maxWidth: 560,
          mx: 'auto',
        }}
      >
        <Stack spacing={3}>
          {/* PROFILE */}
          <AppCard>
            <Stack spacing={2} alignItems="center">
              <Avatar sx={{ width: 72, height: 72 }} />

              <Box textAlign="center">
                <Typography variant="h5" fontWeight={700}>
                  {data.firstName} {data.lastName}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {data.email}
                </Typography>
              </Box>
            </Stack>
          </AppCard>

          {/* ACCOUNT */}
          <AppCard>
            <Stack spacing={2}>
              <Typography variant="h6">Account Information</Typography>

              <Divider />

              <InfoRow label="First name" value={data.firstName} />

              <InfoRow label="Last name" value={data.lastName} />

              <InfoRow label="Email" value={data.email} />
            </Stack>
          </AppCard>

          {/* SECURITY */}
          <AppCard>
            <Stack spacing={2}>
              <Typography variant="h6">Security</Typography>

              <Divider />

              <InfoRow label="Password" value="••••••••" />

              <Button variant="contained">Change Password</Button>
            </Stack>
          </AppCard>
        </Stack>
      </Box>
    </PageContainer>
  )
}

export function MeInfo1({ data }: Props) {
  return (
    <PageContainer>
      <AppCard>
        <Stack spacing={2} alignItems="center">
          <Avatar sx={{ width: 64, height: 64 }} />
          <Typography variant="h5" fontWeight={600}>
            {data.firstName} {data.lastName}
          </Typography>
          <Divider sx={{ width: '100%' }} />
          <Typography variant="body2" color="text.secondary">
            {data.email}
          </Typography>
        </Stack>
      </AppCard>
    </PageContainer>
  )
}
