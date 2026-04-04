import SystemInfo from '@/src/components/system/SystemInfo'
import {
  getAppInfo,
  getAppInfo2,
  getAppInfo3,
} from '@/src/services/app.service'

export default async function Page() {
  const data = await getAppInfo3()
  return <SystemInfo data={data.result} />
}
