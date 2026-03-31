import MeInfo from '@/src/components/auth/MeInfo'
import { getUserInfo } from '@/src/services/auth.service'

export default async function Page() {
  const data = await getUserInfo()
  return <MeInfo data={data} />
}
