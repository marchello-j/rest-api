import {BlogModel, ResponseBlogModel} from '../../types/blogs/output';
import {blogCollection, postCollection} from '../../db/db';
import {blogMapper} from '../../types/blogs/mapers';
import {ObjectId, WithId} from 'mongodb';
import {QueryBlogInput} from '../../types/blogs/query';
import {postMapper} from '../../types/posts/mappers';
import {QueryPostInput} from '../../types/posts/query';
import {BlogDBType, PostDBType} from "../../types/db/db";

export class BlogQueryRepository {
	static async getAllBlogs(sortData: QueryBlogInput): Promise<ResponseBlogModel> {
		const searchNameTerm: string | null = sortData.searchNameTerm ?? null;
		const sortBy: string = sortData.sortBy ?? 'createdAt';
		const sortDirection: string= sortData.sortDirection ?? 'desc';
		const pageNumber: number = sortData.pageNumber ?? 1;
		const pageSize: number = sortData.pageSize ?? 10;
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
		const blogs: WithId<BlogDBType>[] = await blogCollection
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
		const blog: WithId<BlogDBType> | null = await blogCollection.findOne({ _id: new ObjectId(id) });
		if (!blog) {
			return null;
		}
		return blogMapper(blog);
	}
	static async getAllPostsInBlog(sortData: QueryPostInput, blogId: string) {
		const sortBy: string = sortData.sortBy ?? 'createdAt';
		const sortDirection: string = sortData.sortDirection ?? 'desc';
		const pageNumber: number = sortData.pageNumber ?? 1;
		const pageSize: number = sortData.pageSize ?? 10;

		let sort: { [key: string]: 1 | -1 } = { [sortBy]: -1 };
		if (sortDirection === 'asc') {
			sort = {
				[sortBy]: 1,
			};
		}
		const blogs: WithId<PostDBType>[] = await postCollection
			.find({ blogId })
			.sort(sort)
			.skip((+pageNumber - 1) * +pageSize)
			.limit(+pageSize)
			.toArray();

		const totalCount: number = await postCollection.countDocuments({ blogId });

		const pagesCount: number = Math.ceil(totalCount / +pageSize);

		return {
			pagesCount,
			page: +pageNumber,
			pageSize: +pageSize,
			totalCount,
			items: blogs.map(postMapper),
		};
	}
}
