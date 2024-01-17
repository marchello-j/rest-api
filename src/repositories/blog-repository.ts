import { CreateBlogModel, CreatePostBlogModel, UpdateBlogModel } from '../types/blogs/input';
import { BlogModel } from '../types/blogs/output';
import { blogCollection, postCollection } from '../db/db';
import { ObjectId } from 'mongodb';
import { BlogQueryRepository } from './blog-query-repository';
export class BlogRepository {
	static async createBlog(newBlog: CreateBlogModel): Promise<BlogModel> {
		const blog = await blogCollection.insertOne({ ...newBlog });
		return {
			...newBlog,
			id: blog.insertedId.toString(),
		};
	}
	static async createPostToBlog(blogId: string, postData: CreatePostBlogModel) {
		const blog = await BlogQueryRepository.getBlogById(blogId);

		const post = {
			title: postData.title,
			shortDescription: postData.shortDescription,
			content: postData.content,
			blogId: blog!.id,
			blogName: blog!.name,
			createdAt: new Date().toISOString(),
		};

		const res = await postCollection.insertOne(post);
		return res.insertedId.toString();
	}

	static async updateBlog(id: string, updateBlog: UpdateBlogModel): Promise<boolean> {
		if (!ObjectId.isValid(id)) return false;
		const blog = await blogCollection.updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					name: updateBlog.name,
					description: updateBlog.description,
					websiteUrl: updateBlog.websiteUrl,
				},
			}
		);

		return !!blog.matchedCount;
	}
	static async deleteBlog(id: string): Promise<boolean> {
		const blog = await blogCollection.deleteOne({ _id: new ObjectId(id) });
		if (!ObjectId.isValid(id)) {
			return false;
		}
		return !!blog.deletedCount;
	}
}
