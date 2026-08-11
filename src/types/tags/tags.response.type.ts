import { Tag } from './tag.type'

export type TagsResponse = {
  success: boolean
  path: string
  timestamp: string
  data: Tag[]
}
