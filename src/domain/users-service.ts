import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/users/user-repository';
import { userQueryRepository } from '../repositories/users/users-query-repository';
import { CreateUserModel } from '../types/users/input';
import { OutputUserModel } from '../types/users/output';

export const userService = {
	async createUser(createObjUser: CreateUserModel) {
		const passwordSalt = await bcrypt.genSalt(10);
		const passwordHash = await this._generateHash(createObjUser.password, passwordSalt);
		const newUser = {
			login: createObjUser.login,
			email: createObjUser.email,
			passwordHash,
			passwordSalt,
			createdAt: new Date().toISOString(),
		};
		const createdUser = await userRepository.createUser(newUser);
		return createdUser;
	},
	async checkCredentials(loginOrEmail: string, password: string) {
		const user = await userQueryRepository.findByLoginOrEmail(loginOrEmail);
		if (!user) return false;
		const passwordHash = await this._generateHash(password, user.passwordSalt);
		if (user.passwordHash !== passwordHash) return false;
		return true;
	},
	async _generateHash(password: string, salt: string) {
		const hash = await bcrypt.hash(password, salt);
		return hash;
	},
};
