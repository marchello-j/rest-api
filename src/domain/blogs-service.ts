import { BlogQueryRepository } from '../repositories/blogs/blog-query-repository'
import { BlogRepository } from '../repositories/blogs/blog-repository'
import { PostQueryRepository } from '../repositories/posts/post-query-repository'
import {
	CreateBlogModel,
	CreatePostBlogModel,
	UpdateBlogModel,
} from '../types/blogs/input'
import { BlogModel } from '../types/blogs/output'
import { PostModel } from '../types/posts/output'

export class BlogService {
	static async addBlog(createData: CreateBlogModel): Promise<BlogModel> {
		const newBlog = {
			name: createData.name,
			description: createData.description,
			websiteUrl: createData.websiteUrl,
			createdAt: new Date().toISOString(),
			isMembership: false,
		}
		return await BlogRepository.createBlog(newBlog)
	}

	static async addPostToBlog(
		blogId: string,
		postData: CreatePostBlogModel,
	): Promise<PostModel | null> {
		const blog: BlogModel | null = await BlogQueryRepository.getBlogById(blogId)
		if (!blog) {
			return null
		}
		const newPost = {
			title: postData.title,
			shortDescription: postData.shortDescription,
			content: postData.content,
		}
		const createPostId: string = await BlogRepository.createPostToBlog(
			blogId,
			newPost,
		)

		return await PostQueryRepository.getPostById(createPostId)
	}
	static async updatePostToBlog(
		blogID: string,
		data: UpdateBlogModel,
	): Promise<boolean | null> {
		const blog: BlogModel | null = await BlogQueryRepository.getBlogById(blogID)
		if (!blog) {
			return null
		}
		return await BlogRepository.updateBlog(blogID, data)
	}
}
