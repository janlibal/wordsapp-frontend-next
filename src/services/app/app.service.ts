import { apiFetch } from '../../lib/fetcher'
import { AppInfoResponse } from '../../types/app/app.types'

export async function getAppInfo2(): Promise<AppInfoResponse> {
  const res = await fetch('http://api:5000/api/v1/app/info', {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch app info: ${res.status}`)
  }

  return res.json()
}

export async function getAppInfo3(): Promise<AppInfoResponse> {
  return await apiFetch<AppInfoResponse>('/api/api/v1/app/info', {
    method: 'GET',
  })
}

export async function getAppInfo(): Promise<AppInfoResponse> {
  return apiFetch<AppInfoResponse>('/api/api/v1/app/info', {
    method: 'GET',
  })
}

export async function getAppInfo33333(): Promise<AppInfoResponse> {
  return await apiFetch('http://api:5000/api/v1/app/info', {
    method: 'GET',
  })
}
