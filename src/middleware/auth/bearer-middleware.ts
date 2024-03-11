import dotenv from 'dotenv'
import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUSES } from '../../uitls/utils'
import { jwtService } from '../../application/jwt-service'
import { userQueryRepository } from '../../repositories/users/users-query-repository'
import { ObjectId } from 'mongodb'

dotenv.config()

export const bearerAuthMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	if (!req.headers.authorization) {
		res.send(HTTP_STATUSES.UNAUTHORAIZED_401)
		return
	}
	const token: string = req.headers.authorization.split(' ')[1]
	const userId: ObjectId | null = await jwtService.getUserIdByToken(token)
	if (userId) {
		req.user = await userQueryRepository.findUserById(userId.toString())
		next()
	} else {
		res.sendStatus(HTTP_STATUSES.UNAUTHORAIZED_401)
	}
}
