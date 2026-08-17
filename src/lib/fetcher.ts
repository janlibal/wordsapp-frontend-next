import { debug } from '../helpers/debug'
import { ApiError } from '../services/api/ApiError'
import { API_BASE_PATH } from '@/src/config/api'

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

  debug('[API] → Request:', url, {
    method: fetchOptions.method,
    retry: _retry,
    skipRefresh: _skipRefresh,
  })

  const res = await doFetch()

  debug('[API] ← Response:', url, res.status)

  // --------------------------------------------------
  // 401 → attempt token refresh
  // --------------------------------------------------

  if (res.status === 401 && !_retry && !_skipRefresh) {
    debug('[API] ⚠️ 401 detected')

    if (!refreshPromise) {
      debug('[API] 🔒 starting refresh')

      refreshPromise = (async () => {
        try {
          const refreshRes = await fetch(`${API_BASE_PATH}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
          })

          debug('[API] 🔄 Refresh response:', refreshRes.status)

          if (!refreshRes.ok) {
            return false
          }

          debug('[API] ✅ Refresh success')

          return true
        } catch {
          return false
        } finally {
          refreshPromise = null
        }
      })()
    } else {
      debug('[API] ⏳ waiting for ongoing refresh')
    }

    const success = await refreshPromise

    if (!success) {
      debug('[API] ❌ Refresh failed')

      window.dispatchEvent(new Event('auth:logout'))

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

  if (!res.ok) {
    let message = 'Request failed'
    let details: unknown

    try {
      const err = await res.json()

      details = err

      debug('[API] ❌ Raw error response:', err)

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

    debug('[API] ❌ Error:', {
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

  debug('[API] ✅ Success:', url)

  return text ? JSON.parse(text) : (undefined as T)
}
