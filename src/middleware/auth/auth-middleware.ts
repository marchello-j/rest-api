import dotenv from 'dotenv'
import {NextFunction, Request, Response} from 'express'
import {HTTP_STATUSES} from '../../uitls/utils'
import {jwtService} from '../../application/jwt-service'
import {userQueryRepository} from '../../repositories/users/users-query-repository'

dotenv.config()

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    res.send(HTTP_STATUSES.UNAUTHORAIZED_401)
    return
  }
  const token: string = req.headers.authorization.split(' ')[1]
  const userId = await jwtService.getUserIdByToken(token)
  if (userId) {
    req.user = await userQueryRepository.findUserById(userId.toString())
    next()
  }
  res.send(HTTP_STATUSES.UNAUTHORAIZED_401)
  next()
}
