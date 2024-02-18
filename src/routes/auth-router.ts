import {Request, Response, Router} from 'express'

import {userService} from '../domain/users-service'
import {authLoginValidation} from '../validators/auth-validation'
import {HTTP_STATUSES} from '../uitls/utils'
import {jwtService} from '../application/jwt-service'

export const authRouter = Router({})

authRouter.post(
  '/login',
  authLoginValidation(),
  async (req: Request, res: Response) => {
    let { loginOrEmail, password } = req.body
		const user = await userService.checkCredentials(loginOrEmail, password)
    if (user) {
      const token: string = await jwtService.createJWT(user)
      res.status(HTTP_STATUSES.CREATED_201).send({
        accessToken: token
      })
    } else {
      res.sendStatus(HTTP_STATUSES.UNAUTHORAIZED_401)
    }
  }
)
// написать auth сервис для логина
