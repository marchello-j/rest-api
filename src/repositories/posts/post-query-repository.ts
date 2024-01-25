import { PostModel, ResponsePostModel } from '../../types/posts/output';
import { postCollection } from '../../db/db';
import { postMapper } from '../../types/posts/mappers';
import { ObjectId } from 'mongodb';
import { QueryPostInput } from '../../types/posts/query';

export class PostQueryRepository {
	static async getAllPosts(sortData: QueryPostInput): Promise<ResponsePostModel> {
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
			pagesCount: +pagesCount,
			page: +pageNumber,
			pageSize: +pageSize,
			totalCount,
			items: blogs.map(postMapper),
		};
	}
	static async getPostById(id: string): Promise<PostModel | null> {
		if (!ObjectId.isValid(id)) {
			return null;
		}
		const post = await postCollection.findOne({ _id: new ObjectId(id) });
		if (!post) {
			return null;
		}
		return postMapper(post);
	}
}
