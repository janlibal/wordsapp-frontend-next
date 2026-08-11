import { Collection } from './collections.type'

export type CollectionResponse = {
  success: boolean
  path: string
  timestamp: string
  data: Collection[]
}
