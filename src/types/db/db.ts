import { BlogModel } from '../blogs/output'
import { VideoType } from '../video/output'
import { PostModel } from '../posts/output'
import { UsersModel } from '../users/output'

export type DBType = {
  blogs: BlogModel[]
  posts: PostModel[]
  videos: VideoType[]
  users: UsersModel[]
}

export type BlogDBType = {
  name: string
  description: string
  websiteUrl: string
  createdAt: string
  isMembership: boolean
}

export type PostDBType = {
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
}

export type UserDBType = {
  login: string
  email: string
  passwordHash: string
  passwordSalt: string
  createdAt: string
}
