import { AppInfo } from '../../types/app.info.response'
import { UserResponse } from '@/src/types/auth.types'

type Props = {
  data: UserResponse
}

export default function MeInfo({ data }: Props) {
  return <p>{data.id}</p>
}
