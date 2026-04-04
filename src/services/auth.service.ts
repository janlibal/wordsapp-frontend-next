import { apiFetch } from '../lib/fetcher'
import { LoginDto, LoginResponse, RegisterDto, User } from '../types/auth.types'

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

export function logout() {
  return apiFetch<void>('api/api/v1/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })
}
