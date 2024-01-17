import { Response, Router } from 'express';
import { userService } from '../domain/users-service';
import { QueryUsersInput } from '../types/users/query';
import { ResponseUsersModel, UsersModel } from '../types/users/output';
import { Params, RequestWithQuery } from '../types/common';
import { userQueryRepository } from '../repositories/users-query-repository';
import { authMiddleware } from '../middleware/auth/auth-middleware';
import { authLoginValidation } from '../validators/auth-validation';
import { CreateUserModel } from '../types/users/input';
import { RequestWithBody } from '../types/common';
import { RequestWithParams } from '../types/common';
import { userRepository } from '../repositories/user-repository';
import { userPostValidation } from '../validators/user-validators';

export const usersRoute = Router({});

usersRoute.get(
	'/',
	async (req: RequestWithQuery<QueryUsersInput>, res: Response<ResponseUsersModel>) => {
		const sortData = {
			searchLoginTerm: req.query.searchLoginTerm,
			searchEmailTerm: req.query.searchEmailTerm,
			sortBy: req.query.sortBy,
			sortDirection: req.query.sortDirection,
			pageNumber: req.query.pageNumber,
			pageSize: req.query.pageSize,
		};
		const blogs = await userQueryRepository.getAllUsers(sortData);

		return res.send(blogs);
	}
);

usersRoute.post(
	'/',
	authMiddleware,
	userPostValidation(),
	async (req: RequestWithBody<CreateUserModel>, res: Response<UsersModel>) => {
		const inputDto = req.body;
		const user = await userService.createUser(inputDto);
		if (!user) {
			return res.sendStatus(400);
		}
		return res.status(201).send(user);
	}
);

usersRoute.delete(
	'/:id',
	authMiddleware,
	async (req: RequestWithParams<Params>, res: Response<void>) => {
		const id = req.params.id;
		const user = await userQueryRepository.findUserById(id);
		if (!user) {
			return res.sendStatus(404);
		}
		const isDeleted = await userRepository.deleteUser(id);
		if (isDeleted) {
			res.sendStatus(204);
			return;
		}
		res.sendStatus(204);
		return;
	}
);
