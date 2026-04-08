import SystemInfo from '@/src/components/system/SystemInfo'
import { getAppInfo3 } from '@/src/services/app/app.service'

export default async function Page() {
  const data = await getAppInfo3()
  return <SystemInfo data={data.result} />
}
