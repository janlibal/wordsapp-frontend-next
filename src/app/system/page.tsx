import SystemInfo from '@/src/components/system/SystemInfo'
import { getAppInfo } from '@/src/services/app.service'

export default async function Page() {
  const data = await getAppInfo()

  return <SystemInfo data={data.result} />
}
