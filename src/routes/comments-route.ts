import { Response, Router } from 'express'
import { bearerAuthMiddleware } from '../middleware/auth/bearer-middleware'
import { commentValidation } from '../validators/comment-validation'
import { HTTP_STATUSES } from '../uitls/utils'
import {
	Params,
	RequestWithBodyAndParams,
	RequestWithParams
} from '../types/common'
import { BlogRepository } from '../repositories/blogs/blog-repository'
import { CommentsQueryRepository } from '../repositories/comments/comments-query-repository'
import { CommentsModel } from '../types/comments/output'
import { UpdateComment } from '../types/comments/input'
import { commentsService } from '../domain/comments-service'

export const commentsRoute = Router({})

commentsRoute.put(
	'/',
	bearerAuthMiddleware,
	commentValidation(),
	async (
		req: RequestWithBodyAndParams<Params, UpdateComment>,
		res: Response<boolean>
	) => {
		const commentId: string = req.params.id
		const userId: string = req.user!._id.toString()
		const { content } = req.body
		const result = await commentsService.updateComment(commentId, content)
		if (!result) {
			res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
			return
		}
		res.status(HTTP_STATUSES.CREATED_201).send(result)
	}
)

commentsRoute.delete(
	'/:id',
	bearerAuthMiddleware,
	async (req: RequestWithParams<Params>, res: Response) => {
		const id: string = req.params.id
		const comment: CommentsModel | null =
			await CommentsQueryRepository.getCommentById(id)
		if (!comment) {
			return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
		}
		await BlogRepository.deleteBlog(id)
		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
		return
	}
)

commentsRoute.get('/')
