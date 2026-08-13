import { ApiError } from '../services/api/ApiError'

let refreshPromise: Promise<boolean> | null = null

type ApiFetchOptions = RequestInit & {
  _retry?: boolean
  _skipRefresh?: boolean
}

export async function apiFetch<T>(
  url: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { _retry = false, _skipRefresh = false, ...fetchOptions } = options

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
    retry: _retry,
    skipRefresh: _skipRefresh,
  })

  const res = await doFetch()

  console.log('[API] ← Response:', url, res.status)

  // --------------------------------------------------
  // 401 → attempt token refresh
  // --------------------------------------------------

  if (res.status === 401 && !_retry && !_skipRefresh) {
    console.log('[API] ⚠️ 401 detected')

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
        } catch {
          console.log('[API] ❌ Refresh failed')
          console.log('[API] dispatching auth:logout')

          window.dispatchEvent(new Event('auth:logout'))

          return false
        } finally {
          refreshPromise = null
        }
      })()
    } else {
      console.log('[API] ⏳ waiting for ongoing refresh')
    }

    const success = await refreshPromise

    if (!success) {
      throw new ApiError('Unauthorized', 401)
    }

    // Retry original request exactly once.
    return apiFetch<T>(url, {
      ...fetchOptions,
      _retry: true,
    })
  }

  // --------------------------------------------------
  // Non-OK response
  // --------------------------------------------------

  /*if (!res.ok) {
    let message = 'Request failed'
    let details: unknown

    try {
      const err = await res.json()

      details = err

      if (typeof err?.message === 'string') {
        message = err.message
      } else if (Array.isArray(err?.message)) {
        message = err.message.join(', ')
      }
    } catch {
      // Response wasn't JSON.
    }

    console.log('[API] ❌ Error:', {
      status: res.status,
      message,
    })

    throw new ApiError(
      message,
      res.status,
      details
    )
  }*/
  if (!res.ok) {
    let message = 'Request failed'
    let details: unknown

    try {
      const err = await res.json()

      details = err

      console.log('[API] ❌ Raw error response:', err)

      // Your backend error format:
      // {
      //   status: false,
      //   result: {
      //     title: 'Unauthorized',
      //     errors: [...]
      //   }
      // }

      const errors = err?.result?.errors

      if (Array.isArray(errors) && errors.length > 0) {
        message = errors
          .map((error: unknown) => {
            if (typeof error === 'string') {
              return error
            }

            if (
              typeof error === 'object' &&
              error !== null &&
              'message' in error &&
              typeof error.message === 'string'
            ) {
              return error.message
            }

            return null
          })
          .filter(Boolean)
          .join(', ')
      }

      // Fallbacks
      if (message === 'Request failed') {
        if (typeof err?.result?.title === 'string') {
          message = err.result.title
        } else if (typeof err?.message === 'string') {
          message = err.message
        } else if (typeof err?.error === 'string') {
          message = err.error
        }
      }
    } catch {
      // Response wasn't JSON.
    }

    console.log('[API] ❌ Error:', {
      status: res.status,
      message,
      details,
    })

    throw new ApiError(message, res.status, details)
  }

  // --------------------------------------------------
  // Success
  // --------------------------------------------------

  const text = await res.text()

  console.log('[API] ✅ Success:', url)

  return text ? JSON.parse(text) : (undefined as T)
}
