let refreshPromise: Promise<boolean> | null = null

export async function apiFetch<T>(
  url: string,
  options: RequestInit & { _retry?: boolean } = {}
): Promise<T> {
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

  console.log('[API] → Request:', url, {
    method: fetchOptions.method,
    retry: _retry || false,
  })

  let res = await doFetch()

  console.log('[API] ← Response:', url, res.status)

  // 🔁 HANDLE 401 + REFRESH
  if (res.status === 401 && !_retry) {
    console.log('[API] ⚠️ 401 detected')

    // 🔒 Start refresh if not already running
    if (!refreshPromise) {
      console.log('[API] 🔒 starting refresh')

      refreshPromise = (async () => {
        try {
          const refreshRes = await fetch('/api/api/v1/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          })

          console.log('[API] 🔄 Refresh response:', refreshRes.status)

          if (!refreshRes.ok) {
            throw new Error('Refresh failed')
          }

          console.log('[API] ✅ Refresh success')
          return true
        } catch (err) {
          console.log('[API] ❌ Refresh failed → logout')

          window.dispatchEvent(new Event('auth:logout'))
          return false
        } finally {
          refreshPromise = null // 🔑 release lock
        }
      })()
    } else {
      console.log('[API] ⏳ waiting for ongoing refresh')
    }

    const success = await refreshPromise

    if (!success) {
      throw new Error('Unauthorized')
    }

    // 🔁 Retry original request ONCE
    return apiFetch<T>(url, {
      ...fetchOptions,
      _retry: true,
    })
  }

  // ❌ Non-OK response (not 401 handled above)
  if (!res.ok) {
    let message = 'Request failed'

    try {
      const err = await res.json()
      message = err.message || message
    } catch {}

    console.log('[API] ❌ Error:', message)
    throw new Error(message)
  }

  // ✅ Success
  const text = await res.text()

  console.log('[API] ✅ Success:', url)

  return text ? JSON.parse(text) : (undefined as T)
}
