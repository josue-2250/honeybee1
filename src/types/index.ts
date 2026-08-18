export type PersonId = 'me' | 'partner'

export type MessageType = 'text' | 'image' | 'gif'

export interface ChatMessage {
  id: string
  senderId: PersonId
  type: MessageType
  content: string
  timestamp: number
}

export interface Memory {
  id: string
  type: 'image' | 'video'
  url: string
  caption: string
  date: string
  createdAt: number
}

export interface GalleryPhoto {
  id: string
  url: string
  caption: string
  uploadedBy: PersonId
  createdAt: number
}

export interface Wish {
  id: string
  title: string
  description: string
  fulfilled: boolean
  createdAt: number
  fulfilledAt?: number
}

export interface Achievement {
  id: string
  text: string
  date: string
  hearts: Record<PersonId, boolean>
  createdAt: number
}

export interface Profile {
  me: string
  partner: string
  activeUser: PersonId
}

export type WishFilter = 'pending' | 'fulfilled' | 'all'
