import { API_BASE_PATH } from '@/src/config/api'
import { apiFetch } from '../../lib/fetcher'
import {
  ChangePasswordDto,
  ConfirmEmailDto,
  CreatePasswordDto,
  JoinDto,
  LoginDto,
  LoginResponse,
  RegisterDto,
  User,
  VerifyEmailDto,
} from '../../types/auth/auth.types'

export async function createPassword(dto: CreatePasswordDto): Promise<void> {
  await apiFetch(
    `${API_BASE_PATH}/admin/create-password`,
    //'/api/api/v1/admin/create-password',
    {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }
  )
}

export async function verifyEmail(data: VerifyEmailDto): Promise<void> {
  await apiFetch(
    `${API_BASE_PATH}/auth/email/verify`,
    //'/api/api/v1/auth/email/verify',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  )
}

export async function confirmEmail(data: ConfirmEmailDto): Promise<void> {
  await apiFetch(
    `${API_BASE_PATH}/auth/email/confirm`,
    //'/api/api/v1/auth/email/confirm',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  )
}

export async function changePassword(data: ChangePasswordDto): Promise<void> {
  await apiFetch(
    `${API_BASE_PATH}/auth/change-password`,
    // '/api/api/v1/auth/change-password',
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  )
}

export async function getCurrentUser(): Promise<User> {
  const res = await apiFetch<{ data: User }>(
    `${API_BASE_PATH}/auth/me`,
    //'/api/api/v1/auth/me',
    {
      method: 'GET',
    }
  )
  return res.data
}

export function login(data: LoginDto): Promise<void> {
  return apiFetch<void>(
    `${API_BASE_PATH}/auth/email/login`,
    //'api/api/v1/auth/email/login',
    {
      method: 'POST',
      _skipRefresh: true,
      body: JSON.stringify(data),
    }
  )
}

export function register(data: RegisterDto): Promise<void> {
  return apiFetch<void>(
    `${API_BASE_PATH}/auth/email/register`,
    //'api/api/v1/auth/email/register',
    {
      method: 'POST',
      _skipRefresh: true,
      body: JSON.stringify(data),
    }
  )
}

export function join(data: JoinDto): Promise<void> {
  return apiFetch<void>(
    `${API_BASE_PATH}/auth/email/join`,
    // 'api/api/v1/auth/email/join',
    {
      method: 'POST',
      _skipRefresh: true,
      body: JSON.stringify(data),
    }
  )
}

export function logout() {
  return apiFetch<void>(
    `${API_BASE_PATH}/auth/logout`,
    // 'api/api/v1/auth/logout',
    {
      method: 'POST',
      credentials: 'include',
    }
  )
}
