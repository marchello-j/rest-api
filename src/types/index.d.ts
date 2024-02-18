import { UserDBType } from './db/db'
import { WithId } from 'mongodb'

declare global {
	declare namespace Express {
		export interface Request {
			user: WithId<UserDBType> | null
		}
	}
}
