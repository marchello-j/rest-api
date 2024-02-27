import { Response, Router } from 'express'
import { userService } from '../domain/users-service'
import { QueryUsersInput } from '../types/users/query'
import { ResponseUsersModel, UsersModel } from '../types/users/output'
import {
	Params,
	RequestWithBody,
	RequestWithParams,
	RequestWithQuery
} from '../types/common'
import { userQueryRepository } from '../repositories/users/users-query-repository'
import { CreateUserModel } from '../types/users/input'
import { userRepository } from '../repositories/users/user-repository'
import { userPostValidation } from '../validators/user-validators'
import { HTTP_STATUSES } from '../uitls/utils'
import { authBasicMiddleware } from '../middleware/auth/basic-middlware'
import { WithId } from 'mongodb'
import { UserDBType } from '../types/db/db'

export const usersRoute = Router({})
usersRoute.get(
	'/',
	authBasicMiddleware,
	async (
		req: RequestWithQuery<QueryUsersInput>,
		res: Response<ResponseUsersModel>
	) => {
		const sortData = {
			searchLoginTerm: req.query.searchLoginTerm,
			searchEmailTerm: req.query.searchEmailTerm,
			sortBy: req.query.sortBy,
			sortDirection: req.query.sortDirection,
			pageNumber: req.query.pageNumber,
			pageSize: req.query.pageSize
		}
		const blogs: ResponseUsersModel =
			await userQueryRepository.getAllUsers(sortData)

		return res.send(blogs)
	}
)
usersRoute.post(
	'/',
	authBasicMiddleware,
	userPostValidation(),
	async (req: RequestWithBody<CreateUserModel>, res: Response<UsersModel>) => {
		const inputDto: CreateUserModel = req.body
		const user: UsersModel = await userService.createUser(inputDto)
		if (!user) {
			return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
		}
		return res.status(HTTP_STATUSES.CREATED_201).send(user)
	}
)
usersRoute.delete(
	'/:id',
	authBasicMiddleware,
	async (req: RequestWithParams<Params>, res: Response<void>) => {
		const id: string = req.params.id
		const user: WithId<UserDBType> | null =
			await userQueryRepository.findUserById(id)
		if (!user) {
			return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
		}
		const isDeleted: boolean = await userRepository.deleteUser(id)
		if (isDeleted) {
			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
			return
		}
		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
		return
	}
)
