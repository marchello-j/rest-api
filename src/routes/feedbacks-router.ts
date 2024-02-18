import {Router} from 'express'

export const feedbacksRouter = Router({})

// feedbacksRouter.post(
//   '/',
//   authMiddleware,
//   async (req: Request, res: Response) => {
//     const newProduct = await feedbacksServise.sendFeedback(
//       req.body.comment,
//       req.user!._id
//     )
//     res.status(HTTP_STATUSES.CREATED_201).send(newProduct)
//   }
// )
