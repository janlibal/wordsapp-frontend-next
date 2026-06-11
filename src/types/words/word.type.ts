import { CollectionSummary } from '../collections/collection.sumary.type'
import { Tag } from '../tags/tag.type'

export type Word = {
  id: string
  content: string
  favorite: boolean
  createdAt: string
  updatedAt: string
  collectionId?: string
  collection?: CollectionSummary
  tags: Tag[]
}
