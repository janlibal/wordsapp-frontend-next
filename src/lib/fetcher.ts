export async function apiFetch<T>(
  url: string,
  options: RequestInit & { _retry?: boolean } = {}
): Promise<T> {
  // 🔧 strip _retry so fetch doesn't see it
  const { _retry, ...fetchOptions } = options

  const doFetch = () =>
    fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers || {}),
      },
      credentials: 'include',
    })

  let res = await doFetch()

  console.log('[API] Request:', url)
  console.log('[API] Status:', res.status)

  // 🔁 refresh logic
  if (res.status === 401 && !_retry) {
    console.log('[API] 401 → attempting refresh')

    const refreshRes = await fetch('/api/api/v1/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })

    console.log('[API] Refresh status:', refreshRes.status)

    if (!refreshRes.ok) {
      console.log('[API] Refresh failed → logout')
      window.dispatchEvent(new Event('auth:logout'))
      throw new Error('Unauthorized')
    }

    // 🔁 retry original request (with _retry = true)
    return apiFetch<T>(url, {
      ...fetchOptions,
      _retry: true,
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
    const refreshRes = await fetch('/api/api/v1/auth/refresh', {
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
