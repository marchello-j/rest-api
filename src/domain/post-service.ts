import { BlogQueryRepository } from '../repositories/blogs/blog-query-repository';
import { PostQueryRepository } from '../repositories/posts/post-query-repository';
import { PostRepository } from '../repositories/posts/post-repository';
import { CreatePostModel, UpdatePostModel } from '../types/posts/input';

export class PostService {
	static async createPost(createData: CreatePostModel) {
		const blog = await BlogQueryRepository.getBlogById(createData.blogId);
		if (!blog) {
			return null;
		}
		const newPost = {
			title: createData.title,
			shortDescription: createData.shortDescription,
			content: createData.content,
			blogId: blog.id,
			blogName: blog.name,
			createdAt: new Date().toISOString(),
		};
		const createdPost = await PostRepository.createPost(newPost);
		return createdPost;
	}
	static async updatePost (postId: string, data: UpdatePostModel) {
		const post = await PostQueryRepository.getPostById(postId);
		if (!post) {
			return null;
		}
		const resault = await PostRepository.updatePost(postId, data);
		return resault;
	}
}
