import { LoginDto, LoginResponse, RegisterDto, User } from '../types/auth.types'

export async function getUserInfo(): Promise<User> {
  const res = await fetch('http://localhost:80/api/v1/auth/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    //body: JSON.stringify(data),
    credentials: 'include',
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'Failed gathering data')
  }

  return res.json()
}

export async function login(data: LoginDto): Promise<LoginResponse> {
  const res = await fetch('http://localhost:80/api/v1/auth/email/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'Login failed')
  }

  return res.json()
}

export async function register(data: RegisterDto): Promise<boolean> {
  const res = await fetch('http://localhost:80/api/v1/auth/email/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    //credentials: 'include',
  })

  if (!res.ok) {
    throw new Error('Registration failed')
  }

  return true // ✅ don't parse anything
}

export async function login2(data: LoginDto): Promise<LoginResponse> {
  const res = await fetch('http://api:5000/api/v1/auth/email/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include', // ✅ important! send cookies automatically
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'Login failed')
  }

  return res.json() // maybe contains message only
}

export async function logout() {
  await fetch('http://localhost:80/api/v1/auth/logout', {
    method: 'POST',
    credentials: 'include', // include cookie
  })
}
