import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function removeThisRequireAuth<T>(
  fetchUser: (token: string) => Promise<T>
) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  const refreshToken = cookieStore.get('refresh_token')?.value

  // no access token → redirect immediately
  if (!accessToken) redirect('/login')

  try {
    // try fetching the user
    return await fetchUser(accessToken)
  } catch (err: any) {
    // if access token expired, try refresh
    if (refreshToken) {
      //const refreshRes = await fetch('http://api:5000/api/v1/auth/refresh', {
      const refreshRes = await fetch('/api/api/v1/auth/refresh', {
        method: 'POST',
        headers: { Cookie: `refresh_token=${refreshToken}` },
        cache: 'no-store',
        credentials: 'include',
      })
      if (!refreshRes.ok) redirect('/login')
      const refreshData = await refreshRes.json()
      return await fetchUser(refreshData.token)
    }
    redirect('/login')
  }
}
