import { randomUUID } from 'crypto';

import { CreateBlogModel, UpdateBlogModel } from '../types/blogs/input';
import { BlogModel } from '../types/blogs/output';
import { blogCollection } from '../db/db';
import { blogMapper } from '../types/blogs/mapers';
import { ObjectId } from 'mongodb';

export class BlogRepository {
	static async getAllBlogs(): Promise<BlogModel[]> {
		const blogs = await blogCollection.find({}).toArray();

		return blogs.map(blogMapper);
	}
	static async getBlogById(id: string): Promise<BlogModel | null> {
		const blog = await blogCollection.findOne({ _id: new ObjectId(id) });
		if (!blog) {
			return null;
		}
		return blogMapper(blog);
	}

	static async createBlog(createData: CreateBlogModel): Promise<BlogModel> {
		const blog = await blogCollection.insertOne(createData);
		const newBlog = {
			name: createData.name,
			description: createData.description,
			websiteUrl: createData.websiteUrl,
			createdAt: new Date().toISOString(),
			isMembership: false,
		};
		return {
			...newBlog,
			id: blog.insertedId.toString(),
		};
	}

	static async updateBlog(
		id: string,
		updateBlog: UpdateBlogModel
	): Promise<boolean> {
		if(!ObjectId.isValid(id)) return false
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
		return !!blog.deletedCount;
	}
}
