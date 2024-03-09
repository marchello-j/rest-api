import { Request, Response, Router } from 'express'
import nodemailer from 'nodemailer'

import { userService } from '../domain/users-service'
import { authLoginValidation } from '../validators/auth-validation'
import { HTTP_STATUSES } from '../uitls/utils'
import { jwtService } from '../application/jwt-service'
import { UserDBType } from '../types/db/db'
import { bearerAuthMiddleware } from '../middleware/auth/bearer-middleware'
import { userPostValidation } from '../validators/user-validators'
import { WithId } from 'mongodb'

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
	'/send',
	userPostValidation(),
	async (req: Request, res: Response) => {
		let transport = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'anamaryraik@gmail.com',
				pass: 'SuperDeveloper2024'
			}
		})

		const info = await transport.sendMail({
			from: '"Anamary 👻" <anamaryraik@gmail.com>', // sender address
			to: req.body.email,
			subject: req.body.subject, // Subject line
			text: 'Hello world?', // plain text body
			html: req.body.html // html body
		})
		console.log(info)

		res.send({
			email: req.body.email,
			message: req.body.message,
			subject: req.body.subject
		})
	}
)
