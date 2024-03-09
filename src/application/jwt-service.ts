import jwt from 'jsonwebtoken'
import { UserDBType } from '../types/db/db'
import dotenv from 'dotenv'
import { ObjectId, WithId } from 'mongodb'
import { envSetting } from '../envSetting'

dotenv.config()
export const jwtService = {
	async createJWT(user: WithId<UserDBType>) {
		const token: string = jwt.sign(
			{ userId: user._id },
			envSetting.JWT_SECRET,
			{
				expiresIn: '30h'
			}
		)
		return token
	},
	async getUserIdByToken(token: string) {
		try {
			const result: any = jwt.verify(token, envSetting.JWT_SECRET)
			console.log(result)
			return new ObjectId(result.userId)
		} catch (error) {
			return null
		}
	}
}
