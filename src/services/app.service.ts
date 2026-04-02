import {  fetcher } from '../lib/fetcher'
import { AppInfoResponse } from '../types/app/app.types'

/*export async function getAppInfo(): Promise<AppInfoResponse> {
  const res = await fetch('http://api:5000/api/v1/app/info', {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch app info: ${res.status}`)
  }

  return res.json()
}*/

export function getAppInfo() {
  return fetcher<AppInfoResponse>('/api/v1/app/info')

}
