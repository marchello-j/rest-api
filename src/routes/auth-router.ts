import { Request, Response, Router } from 'express'

import { userService } from '../domain/users-service'
import { authLoginValidation } from '../validators/auth-validation'
import { HTTP_STATUSES } from '../uitls/utils'
import { jwtService } from '../application/jwt-service'
import { UserDBType } from '../types/db/db'
import { bearerAuthMiddleware } from '../middleware/auth/bearer-middleware'
import { userPostValidation } from '../validators/user-validators'
import { WithId } from 'mongodb'
import { emailAdapter } from '../adapters/email-adapter'

export const authRouter = Router({})

authRouter.post(
	'/login',
	authLoginValidation(),
	async (req: Request, res: Response) => {
		let { loginOrEmail, password } = req.body
		const user: WithId<UserDBType> | null = await userService.checkCredentials(
			loginOrEmail,
			password
		)
		if (user) {
			const token: string = await jwtService.createJWT(user)
			res.status(HTTP_STATUSES.OK_200).send({
				accessToken: token
			})
		} else {
			res.sendStatus(HTTP_STATUSES.UNAUTHORAIZED_401)
		}
	}
)
authRouter.get(
	'/me',
	bearerAuthMiddleware,
	async (req: Request, res: Response) => {
		const userId: string = req.user!._id.toString()
		const userLogin: string = req.user!.login.toString()
		const userEmail: string = req.user!.email.toString()

		res.status(HTTP_STATUSES.OK_200).send({
			email: userEmail,
			login: userLogin,
			userId: userId
		})
	}
)

authRouter.post(
	'/registration',
	userPostValidation(),
	async (req: Request, res: Response) => {
		await emailAdapter.sendEmail(
			req.body.login,
			req.body.password,
			req.body.email
		)
		res.sendStatus(HTTP_STATUSES.CREATED_201)
	}
)

authRouter.post(
	'/registration-email-resending',
	(req: Request, res: Response) => {}
)

authRouter.post(
	'/registration-confirmation',
	(req: Request, res: Response) => {}
)
