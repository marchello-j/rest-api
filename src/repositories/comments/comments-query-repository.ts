import { QueryCommentsInput } from '../../types/comments/query'
import { commentsCollection } from '../../db/db'
import { commentMapper } from '../../types/comments/mappers'
import { ObjectId, WithId } from 'mongodb'
import {
	CommentsModel,
	ResponseCommentsModel
} from '../../types/comments/output'
import { CommentsDBType } from '../../types/db/db'

export class CommentsQueryRepository {
	static async getAllCommentsForSpecificPost(
		sortData: QueryCommentsInput,
		postId: string
	): Promise<ResponseCommentsModel> {
		const pageNumber: number = sortData.pageNumber ?? 1
		const pageSize: number = sortData.pageSize ?? 10
		const sortBy: string = sortData.sortBy ?? 'createdAt'
		const sortDirection: string = sortData.sortDirection ?? 'desc'

		let sort: { [key: string]: 1 | -1 } = { [sortBy]: -1 }
		if (sortDirection === 'asc') {
			sort = {
				[sortBy]: 1
			}
		}
		const comments: WithId<CommentsDBType>[] = await commentsCollection
			.find({ postId })
			.sort(sort)
			.skip((+pageNumber - 1) * +pageSize)
			.limit(+pageSize)
			.toArray()
		const totalCount: number = await commentsCollection.countDocuments({
			postId
		})
		const pagesCount: number = Math.ceil(totalCount / +pageSize)
		return {
			pagesCount: +pagesCount,
			page: +pageNumber,
			pageSize: +pageSize,
			totalCount,
			items: comments.map(commentMapper)
		}
	}
	static async getCommentById(id: string): Promise<CommentsModel | null> {
		if (!ObjectId.isValid(id)) {
			return null
		}
		const comment: WithId<CommentsDBType> | null =
			await commentsCollection.findOne({
				_id: new ObjectId(id)
			})
		if (!comment) {
			return null
		}
		return commentMapper(comment)
	}
}
