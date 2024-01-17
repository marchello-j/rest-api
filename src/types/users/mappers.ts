import { WithId } from 'mongodb';
import { UserDBType } from '../db/db';
import { UsersModel } from './output';

export const userMapper = (userDB: WithId<UserDBType>): UsersModel => {
	return {
		id: userDB._id.toString(),
		login: userDB.login,
		email: userDB.email,
		createdAt: userDB.createdAt,
	};
};
