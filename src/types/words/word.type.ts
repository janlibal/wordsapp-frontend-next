import { Tag } from '../tags/tag.type'

export type Word = {
  id: string
  content: string
  favorite: boolean
  createdAt: string
  updatedAt: string
  tags: Tag[]
}
