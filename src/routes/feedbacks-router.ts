import { Request, Response, Router } from 'express'
import { authMiddleware } from '../middleware/auth/auth-middleware'
import { commentValidation } from '../validators/comment-validation'
import { feedbackService } from '../domain/feedback-service'
import { HTTP_STATUSES } from '../uitls/utils'

export const feedbacksRouter = Router({})

feedbacksRouter.post(
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

feedbacksRouter.post('put', async (req: Request, res: Response) => {})
