import bcrypt from 'bcrypt'
import { userRepository } from '../repositories/users/user-repository'
import { userQueryRepository } from '../repositories/users/users-query-repository'
import { CreateUserModel } from '../types/users/input'
import { UsersModel } from '../types/users/output'
import { UserDBType } from '../types/db/db'
import { WithId } from 'mongodb'

export const userService = {
	async createUser(createObjUser: CreateUserModel): Promise<UsersModel> {
		const passwordSalt: string = await bcrypt.genSalt(10)
		const passwordHash: string = await this._generateHash(
			createObjUser.password,
			passwordSalt
		)
		const newUser = {
			login: createObjUser.login,
			email: createObjUser.email,
			passwordHash,
			passwordSalt,
			createdAt: new Date().toISOString()
		}
		return await userRepository.createUser(newUser)
	},
	async checkCredentials(
		loginOrEmail: string,
		password: string
	): Promise<WithId<UserDBType> | null> {
		const user: WithId<UserDBType> | null =
			await userQueryRepository.findByLoginOrEmail(loginOrEmail)
		if (!user) return null
		const passwordHash: string = await this._generateHash(
			password,
			user.passwordSalt
		)
		if (user.passwordHash !== passwordHash) return null
		return user
	},
	async _generateHash(password: string, salt: string): Promise<string> {
		return await bcrypt.hash(password, salt)
	}
}
