import { Response, Router } from 'express'
import { bearerAuthMiddleware } from '../middleware/auth/bearer-middleware'
import { commentValidation } from '../validators/comment-validation'
import { HTTP_STATUSES } from '../uitls/utils'
import {
	Params,
	RequestWithBodyAndParams,
	RequestWithParams
} from '../types/common'
import { CommentsQueryRepository } from '../repositories/comments/comments-query-repository'
import { CommentsModel } from '../types/comments/output'
import { UpdateComment } from '../types/comments/input'
import { commentsService } from '../domain/comments-service'
import { CommentsRepository } from '../repositories/comments/comments-repository'

export const commentsRoute = Router({})

commentsRoute.put(
	'/:id',
	bearerAuthMiddleware,
	commentValidation(),
	async (
		req: RequestWithBodyAndParams<Params, UpdateComment>,
		res: Response<boolean>
	) => {
		const commentId: string = req.params.id
		const { content } = req.body
		const userIdFromParams: string = req.params.id
		const exsistngPost: CommentsModel | null =
			await CommentsQueryRepository.getCommentById(userIdFromParams)
		if (!exsistngPost) {
			res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
			return
		}
		const result = await commentsService.updateComment(commentId, content)

		if (!result) {
			res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
			return
		}
		res.status(HTTP_STATUSES.NO_CONTENT_204).send(result)
	}
)

commentsRoute.delete(
	'/:id',
	bearerAuthMiddleware,
	async (req: RequestWithParams<Params>, res: Response) => {
		const id: string = req.params.id
		const userIdFromParams: string = req.params.id
		const comment: CommentsModel | null =
			await CommentsQueryRepository.getCommentById(id)
		if (!comment) {
			return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
		}
		await CommentsRepository.deleteComment(id)
		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
		return
	}
)

commentsRoute.get(
	'/:id',
	async (req: RequestWithParams<Params>, res: Response) => {
		const id: string = req.params.id
		const comment: CommentsModel | null =
			await CommentsQueryRepository.getCommentById(id)
		if (!comment) {
			return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
		}
		res.status(HTTP_STATUSES.OK_200).send(comment)
		return
	}
)
