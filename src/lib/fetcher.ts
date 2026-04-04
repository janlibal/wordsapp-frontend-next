export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  let res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
  })

  if (res.status === 401) {
    const refreshRes = await fetch('api/api/v1/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })

    if (!refreshRes.ok) {
      // 🔥 GLOBAL LOGOUT TRIGGER
      window.dispatchEvent(new Event('auth:logout'))
      throw new Error('Unauthorized')
    }

    // retry original request
    res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      credentials: 'include',
    })
  }

  if (!res.ok) {
    let message = 'Request failed'
    try {
      const err = await res.json()
      message = err.message || message
    } catch {}
    throw new Error(message)
  }

  const text = await res.text()
  return text ? JSON.parse(text) : (undefined as T)
}

export async function apiFetch1<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  let res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
  })

  if (res.status === 401) {
    // 🔥 try refresh
    const refreshRes = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })

    if (!refreshRes.ok) {
      throw new Error('Unauthorized')
    }

    // 🔁 retry original request
    res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      credentials: 'include',
    })
  }

  if (!res.ok) {
    let message = 'Request failed'
    try {
      const err = await res.json()
      message = err.message || message
    } catch {}
    throw new Error(message)
  }

  const text = await res.text()
  return text ? JSON.parse(text) : (undefined as T)
}

export async function apiFetch2<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
  })

  if (!res.ok) {
    let message = 'Request failed'
    try {
      const err = await res.json()
      message = err.message || message
    } catch {}
    throw new Error(message)
  }

  const text = await res.text()
  return text ? JSON.parse(text) : (undefined as T)
}
