import { UserDBType } from './db/db'

declare global {
  declare namespace Express {
    export interface Request {
      user: UserDBType | null
    }
  }
}
