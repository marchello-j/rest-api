import { BlogQueryRepository } from '../repositories/blog-query-repository';
import { BlogRepository } from '../repositories/blog-repository';
import { PostQueryRepository } from '../repositories/post-query-repository';
import { CreateBlogModel, UpdateBlogModel } from '../types/blogs/input';
import { CreatePostBlogModel } from '../types/blogs/input';

export class BlogService {
	static async addBlog(createData: CreateBlogModel) {
		const newBlog = {
			name: createData.name,
			description: createData.description,
			websiteUrl: createData.websiteUrl,
			createdAt: new Date().toISOString(),
			isMembership: false,
		};
		const createdBlog = await BlogRepository.createBlog(newBlog);
		return createdBlog;
	}

	static async addPostToBlog(blogId: string, postData: CreatePostBlogModel) {
		const blog = await BlogQueryRepository.getBlogById(blogId);
		if (!blog) {
			return null;
		}
		const newPost = {
			title: postData.title,
			shortDescription: postData.shortDescription,
			content: postData.content,
		};
		const createPostId = await BlogRepository.createPostToBlog(blogId, newPost);

		const post = await PostQueryRepository.getPostById(createPostId);
		return post;
	}
	static async updatePostToBlog(blogID: string, data: UpdateBlogModel) {
		const blog = await BlogQueryRepository.getBlogById(blogID);
		if (!blog) {
			return null;
		}
		const resault = await BlogRepository.updateBlog(blogID, data);
		return resault;
	}
}
