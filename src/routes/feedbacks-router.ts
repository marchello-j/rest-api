import { Request, Response, Router } from 'express'
import { authMiddleware } from '../middleware/auth/auth-middleware'
import { commentValidation } from '../validators/comment-validation'
import { feedbackService } from '../domain/feedback-service'
import { HTTP_STATUSES } from '../uitls/utils'
import { Params, RequestWithParams } from '../types/common'
import { BlogRepository } from '../repositories/blogs/blog-repository'
import { FeedbackRepository } from '../repositories/feedbacks/feedback-repository'

export const feedbacksRouter = Router({})

feedbacksRouter.put(
	'/',
	authMiddleware,
	commentValidation(),
	async (req: Request, res: Response) => {
		const newProduct = await feedbackService.sendFeedback(
			req.body.comment,
			req.user!._id
		)
		res.status(HTTP_STATUSES.CREATED_201).send(newProduct)
	}
)

feedbacksRouter.delete(
	'/:id',
	authMiddleware,
	async (req: RequestWithParams<Params>, res: Response) => {
		const id: string = req.params.id
		const comment: boolean = await FeedbackRepository.deleteComment(id)
		if (!comment) {
			return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
		}
		await BlogRepository.deleteBlog(id)
		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
		return
	}
)
