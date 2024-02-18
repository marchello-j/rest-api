import jwt from 'jsonwebtoken'
import { UserDBType } from '../types/db/db'
import dotenv from 'dotenv'
import { ObjectId } from 'mongodb'
import { envSetting } from '../envSetting'

dotenv.config()
export const jwtService = {
	async createJWT(userId: UserDBType) {
		const token: string = jwt.sign({ userId }, envSetting.JWT_SECRET, {
			expiresIn: '30h'
		})
		return token
	},
	async getUserIdByToken(token: string) {
		try {
			const result: any = jwt.verify(token, envSetting.JWT_SECRET)
			return new ObjectId(result.userId)
		} catch (error) {
			return null
		}
	}
}
