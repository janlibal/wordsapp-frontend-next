export async function fetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Fetch error: ${res.status}`)
  }

  return res.json()
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export async function fetcher2<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    cache: 'no-store',
    credentials: 'include', // future-proof for cookies
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options?.headers || {}),
    },
  })

  if (!res.ok) {
    let message = `Fetch error: ${res.status}`

    try {
      const data = await res.json()
      message = data.message || message
    } catch {}

    throw new Error(message)
  }

  return res.json()
}
