import { CommentsModel } from '../types/comments/output'
import { CommentsQueryRepository } from '../repositories/comments/comments-query-repository'
import { CommentsRepository } from '../repositories/comments/comments-repository'
import { CommentsDBType } from '../types/db/db'
import { ObjectId } from 'mongodb'
import { ResultCode } from '../types/common'

export class commentsService {
	static async addCommentsToPost(
		postId: string,
		createData: string,
		userId: string,
		userLogin: string
	): Promise<CommentsModel | null> {
		const newComment: CommentsDBType = {
			postId,
			content: createData,
			commentatorInfo: {
				userId: userId,
				userLogin: userLogin
			},
			createdAt: new Date().toISOString()
		}
		return await CommentsRepository.createComment(newComment)
	}
	static async updateComment(
		commentId: string,
		content: string,
		userId: ObjectId
	): Promise<boolean | null> {
		const comment: CommentsModel | null =
			await CommentsQueryRepository.getCommentById(commentId)
		if (!comment) {
			return null
		}
		const validationResult = await CommentsRepository.findByUserAndCommentId(
			userId,
			commentId
		)
		if (!validationResult) return validationResult
		await CommentsRepository.updateComment(commentId, content)
		return true
	}

	static async deleteComment(commentId: string, userId: ObjectId) {
		const comment: CommentsModel | null =
			await CommentsQueryRepository.getCommentById(commentId)
		if (!comment)
			return {
				code: ResultCode.NotFound,
				errorMessage: `Comment with ${userId} not found`
			}
		if (comment.commentatorInfo.userId.toString() !== userId.toString())
			return {
				code: ResultCode.Forbidden,
				errorMessage: `Incorrect ${userId}`
			}
		const deleteResult = await CommentsRepository.deleteComment(commentId)
		return {
			code: ResultCode.Success
		}
	}
}
