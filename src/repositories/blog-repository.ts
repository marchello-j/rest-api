import { randomUUID } from 'crypto';

import { CreateBlogModel, CreatePostBlogModel, UpdateBlogModel } from '../types/blogs/input';
import { BlogModel } from '../types/blogs/output';
import { blogCollection, postCollection } from '../db/db';
import { blogMapper } from '../types/blogs/mapers';
import { ObjectId } from 'mongodb';
import { QueryBlogInput } from '../types/blogs/query';

export class BlogRepository {
	static async getAllBlogs(sortData: QueryBlogInput) {
		const searchNameTerm = sortData.searchNameTerm ?? null;
		const sortBy = sortData.sortBy ?? 'createdAt';
		const sortDirection = sortData.sortDirection ?? 'desc';
		const pageNumber = sortData.pageNumber ?? 1;
		const pageSize = sortData.pageSize ?? 10;
		let filter = {};
		if (searchNameTerm) {
			filter = {
				name: { $regex: searchNameTerm, $options: 'i' },
			};
		}
		let sort: { [key: string]: 1 | -1 } = { [sortBy]: -1 };
		if (sortDirection === 'asc') {
			sort = {
				[sortBy]: 1,
			};
		}
		const blogs = await blogCollection
			.find(filter)
			.sort(sort)
			.skip((+pageNumber - 1) * +pageSize)
			.limit(+pageSize)
			.toArray();
		const totalCount = await blogCollection.countDocuments(filter);
		const pagesCount = Math.ceil(totalCount / +pageSize);
		return {
			pagesCount,
			page: +pageNumber,
			pageSize: +pageSize,
			totalCount,
			items: blogs.map(blogMapper),
		};
	}
	static async getBlogById(id: string): Promise<BlogModel | null> {
		if (!ObjectId.isValid(id)) {
			return null;
		}
		const blog = await blogCollection.findOne({ _id: new ObjectId(id) });
		if (!blog) {
			return null;
		}
		return blogMapper(blog);
	}

	static async createBlog(createData: CreateBlogModel): Promise<BlogModel> {
		const newBlog = {
			name: createData.name,
			description: createData.description,
			websiteUrl: createData.websiteUrl,
			createdAt: new Date().toISOString(),
			isMembership: false,
		};
		const blog = await blogCollection.insertOne({ ...newBlog });
		return {
			...newBlog,
			id: blog.insertedId.toString(),
		};
	}
	static async createPostToBlog(blogId: string, postData: CreatePostBlogModel) {
		const blog = await BlogRepository.getBlogById(blogId);

		const post = {
			title: postData.title,
			shortDescription: postData.shortDescription,
			content: postData.content,
			blogId: blog!.id,
			blogName: blog!.name,
			createdAt: new Date().toISOString(),
		};

		const res = await postCollection.insertOne(post);
		return res.insertedId;
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
