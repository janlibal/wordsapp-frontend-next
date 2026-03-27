export async function loginREal(email: string, password: string) {
  const res = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    throw new Error('Login failed')
  }

  return res.json()
}

export async function login(email: string, password: string) {
  // 🧪 MOCK MODE
  if (email === 'test@test.com' && password === '1234') {
    return {
      access_token: 'fake-jwt-token-123',
    }
  }

  // 🔴 REAL BACKEND (later)
  const res = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    throw new Error('Login failed')
  }

  return res.json()
}
