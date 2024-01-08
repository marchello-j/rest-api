import { CreatePostModel, UpdatePostModel } from '../types/posts/input';
import { PostModel } from '../types/posts/output';
import { BlogRepository } from './blog-repository';
import { postCollection } from '../db/db';
import { postMapper } from '../types/posts/mappers';
import { ObjectId } from 'mongodb';
import { QueryPostInput } from '../types/posts/query';

export class PostRepository {
	static async getAllPosts(sortData: QueryPostInput) {
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
			.find({})
			.sort(sort)
			.skip((+pageNumber - 1) * +pageSize)
			.limit(+pageSize)
			.toArray();

		const totalCount = await postCollection.countDocuments({});

		const pagesCount = Math.ceil(totalCount / +pageSize);

		return {
			pagesCount,
			page: +pageNumber,
			pageSize: +pageSize,
			totalCount,
			items: blogs.map(postMapper),
		};
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

	static async getPostById(id: ObjectId): Promise<PostModel | null> {
		const post = await postCollection.findOne({ _id: id });
		if (!post) {
			return null;
		}
		return postMapper(post);
	}
	static async createPost(createData: CreatePostModel): Promise<PostModel | null> {
		const blog = await BlogRepository.getBlogById(createData.blogId);
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
		const addNewPost = await postCollection.insertOne({ ...newPost });
		return {
			...newPost,
			id: addNewPost.insertedId.toString(),
		};
	}
	static async updatePost(id: string, body: UpdatePostModel): Promise<boolean> {
		const updateResult = await postCollection.updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					title: body.title,
					shortDescription: body.shortDescription,
					content: body.content,
					blogId: body.blogId,
				},
			}
		);
		return !!updateResult.matchedCount;
	}
	static async deletePost(id: string) {
		const resDelete = await postCollection.deleteOne({ _id: new ObjectId(id) });
		return !!resDelete.deletedCount;
	}
}
