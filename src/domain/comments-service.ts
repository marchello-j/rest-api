import { CommentsModel } from '../types/comments/output'
import { CommentsQueryRepository } from '../repositories/comments/comments-query-repository'
import { CommentsRepository } from '../repositories/comments/comments-repository'
import { CreateCommentsModel } from '../types/comments/input'

export class commentsService {
	static async addCommentsToPost(
		postId: string,
		createData: string,
		userId: string,
		userLogin: string
	): Promise<CreateCommentsModel | null> {
		const comment: CommentsModel | null =
			await CommentsQueryRepository.getCommentById(postId)
		if (!comment) {
			return null
		}
		const newComment = {
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
		content: string
	): Promise<boolean | null> {
		const comment: CommentsModel | null =
			await CommentsQueryRepository.getCommentById(commentId)
		if (!comment) {
			return null
		}
		//добавить проверку что юзер являеться владельцем комментария
		return await CommentsRepository.updateComment(commentId, content)
	}
}
