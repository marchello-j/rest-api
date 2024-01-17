import { BlogModel } from '../types/blogs/output';
import { blogCollection, postCollection } from '../db/db';
import { blogMapper } from '../types/blogs/mapers';
import { ObjectId } from 'mongodb';
import { QueryBlogInput } from '../types/blogs/query';
import { ResponseBlogModel } from '../types/blogs/output';
import { postMapper } from '../types/posts/mappers';
import { QueryPostInput } from '../types/posts/query';

export class BlogQueryRepository {
	static async getAllBlogs(sortData: QueryBlogInput): Promise<ResponseBlogModel> {
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
	static async getAllPostsInBlog(sortData: QueryPostInput, blogId: string) {
		const sortBy = sortData.sortBy ?? 'createdAt';
		const sortDirection = sortData.sortDirection ?? 'desc';
		const pageNumber = sortData.pageNumber ?? 1;
		const pageSize = sortData.pageSize ?? 10;

		let sort: { [key: string]: 1 | -1 } = { [sortBy]: -1 };
		if (sortDirection === 'asc') {
			sort = {
				[sortBy]: 1,
			};
		}
		const blogs = await postCollection
			.find({ blogId })
			.sort(sort)
			.skip((+pageNumber - 1) * +pageSize)
			.limit(+pageSize)
			.toArray();

		const totalCount = await postCollection.countDocuments({ blogId });

		const pagesCount = Math.ceil(totalCount / +pageSize);

		return {
			pagesCount,
			page: +pageNumber,
			pageSize: +pageSize,
			totalCount,
			items: blogs.map(postMapper),
		};
	}
}
