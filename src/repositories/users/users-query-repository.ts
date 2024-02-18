import { ObjectId, WithId } from 'mongodb'
import { userCollection } from '../../db/db'
import { UserDBType } from '../../types/db/db'
import { ResponseUsersModel } from '../../types/users/output'
import { userMapper } from '../../types/users/mappers'
import { QueryUsersInput } from '../../types/users/query'

export class userQueryRepository {
	static async getAllUsers(
		sortData: QueryUsersInput
	): Promise<ResponseUsersModel> {
		const searchLoginTerm: string | null = sortData.searchLoginTerm ?? null
		const searchEmailTerm: string | null = sortData.searchEmailTerm ?? null
		const sortBy: string = sortData.sortBy ?? 'createdAt'
		const sortDirection: string = sortData.sortDirection ?? 'desc'
		const pageNumber: number = sortData.pageNumber ?? 1
		const pageSize: number = sortData.pageSize ?? 10

		let filter: any = { $or: [] }
		if (searchEmailTerm) {
			filter['$or']?.push({ email: { $regex: searchEmailTerm, $options: 'i' } })
		}
		if (searchLoginTerm) {
			filter['$or']?.push({ login: { $regex: searchLoginTerm, $options: 'i' } })
		}
		if (filter['$or']?.length === 0) {
			filter['$or']?.push({})
		}

		let sort: { [key: string]: 1 | -1 } = { [sortBy]: -1 }
		if (sortDirection === 'asc') {
			sort = {
				[sortBy]: 1
			}
		}
		const blogs: WithId<UserDBType>[] = await userCollection
			.find(filter)
			.sort(sort)
			.skip((+pageNumber - 1) * +pageSize)
			.limit(+pageSize)
			.toArray()
		const totalCount: number = await userCollection.countDocuments(filter)
		const pagesCount: number = Math.ceil(totalCount / +pageSize)
		return {
			pagesCount,
			page: +pageNumber,
			pageSize: +pageSize,
			totalCount,
			items: blogs.map(userMapper)
		}
	}
	static async findUserById(id: string): Promise<WithId<UserDBType> | null> {
		let product: WithId<UserDBType> | null = await userCollection.findOne({
			_id: new ObjectId(id)
		})
		if (product) {
			return product
		} else {
			return null
		}
	}
	static async findByLoginOrEmail(
		loginOrEmail: string
	): Promise<UserDBType | null> {
		const user: WithId<UserDBType> | null = await userCollection.findOne({
			$or: [{ email: loginOrEmail }, { login: loginOrEmail }]
		})
		return user
	}
}
