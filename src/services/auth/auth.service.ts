import { apiFetch } from '../../lib/fetcher'
import {
  ChangePasswordDto,
  ConfirmEmailDto,
  JoinDto,
  LoginDto,
  LoginResponse,
  RegisterDto,
  User,
  VerifyEmailDto,
} from '../../types/auth/auth.types'

export async function verifyEmail(data: VerifyEmailDto): Promise<void> {
  await apiFetch('/api/api/v1/auth/email/verify', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function confirmEmail(data: ConfirmEmailDto): Promise<void> {
  await apiFetch('/api/api/v1/auth/email/confirm', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function changePassword(data: ChangePasswordDto): Promise<void> {
  await apiFetch('/api/api/v1/auth/change-password', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function getCurrentUser(): Promise<User> {
  const res = await apiFetch<{ result: User }>('/api/api/v1/auth/me', {
    method: 'GET',
  })
  return res.result
}

export function login(data: LoginDto): Promise<void> {
  return apiFetch<void>('api/api/v1/auth/email/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function register(data: RegisterDto): Promise<void> {
  return apiFetch<void>('api/api/v1/auth/email/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

export function join(data: JoinDto): Promise<void> {
  return apiFetch<void>('api/api/v1/auth/email/join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

export function logout() {
  return apiFetch<void>('api/api/v1/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })
}
