import {PostModel, ResponsePostModel} from '../../types/posts/output';
import {postCollection} from '../../db/db';
import {postMapper} from '../../types/posts/mappers';
import {ObjectId, WithId} from 'mongodb';
import {QueryPostInput} from '../../types/posts/query';
import {PostDBType} from "../../types/db/db";

export class PostQueryRepository {
	static async getAllPosts(sortData: QueryPostInput): Promise<ResponsePostModel> {
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
			.find({})
			.sort(sort)
			.skip((+pageNumber - 1) * +pageSize)
			.limit(+pageSize)
			.toArray();
		const totalCount: number = await postCollection.countDocuments({});
		const pagesCount: number = Math.ceil(totalCount / +pageSize);
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
		const post: WithId<PostDBType> | null	 = await postCollection.findOne({ _id: new ObjectId(id) });
		if (!post) {
			return null;
		}
		return postMapper(post);
	}
}
