import {BlogQueryRepository} from '../repositories/blogs/blog-query-repository';
import {PostQueryRepository} from '../repositories/posts/post-query-repository';
import {PostRepository} from '../repositories/posts/post-repository';
import {CreatePostModel, UpdatePostModel} from '../types/posts/input';
import {PostModel} from "../types/posts/output";
import {BlogModel} from "../types/blogs/output";

export class PostService {
	static async createPost(createData: CreatePostModel): Promise<PostModel | null> {
		const blog: BlogModel | null = await BlogQueryRepository.getBlogById(createData.blogId);
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
		const createdPost: PostModel | null = await PostRepository.createPost(newPost);
		return createdPost;
	}
	static async updatePost (postId: string, data: UpdatePostModel): Promise<boolean | null> {
		const post: PostModel | null = await PostQueryRepository.getPostById(postId);
		if (!post) {
			return null;
		}
		const resault: boolean = await PostRepository.updatePost(postId, data);
		return resault;
	}
}
