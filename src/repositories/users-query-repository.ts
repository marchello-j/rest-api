import { ObjectId } from 'mongodb';
import { userCollection } from '../db/db';
import { UserDBType } from '../types/db/db';
import { ResponseUsersModel, UsersModel } from '../types/users/output';
import { userMapper } from '../types/users/mappers';
import { QueryUsersInput } from '../types/users/query';

export class userQueryRepository {
	static async getAllUsers(sortData: QueryUsersInput): Promise<ResponseUsersModel> {
		const searchLoginTerm = sortData.searchLoginTerm ?? null;
		const searchEmailTerm = sortData.searchEmailTerm ?? null;
		const sortBy = sortData.sortBy ?? 'createdAt';
		const sortDirection = sortData.sortDirection ?? 'desc';
		const pageNumber = sortData.pageNumber ?? 1;
		const pageSize = sortData.pageSize ?? 10;

		let filter: any = { $or: [] };
		if (searchEmailTerm) {
			filter['$or']?.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
		}
		if (searchLoginTerm) {
			filter['$or']?.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
		}
		if (filter['$or']?.length === 0) {
			filter['$or']?.push({});
		}

		let sort: { [key: string]: 1 | -1 } = { [sortBy]: -1 };
		if (sortDirection === 'asc') {
			sort = {
				[sortBy]: 1,
			};
		}
		const blogs = await userCollection
			.find(filter)
			.sort(sort)
			.skip((+pageNumber - 1) * +pageSize)
			.limit(+pageSize)
			.toArray();
		const totalCount = await userCollection.countDocuments(filter);
		const pagesCount = Math.ceil(totalCount / +pageSize);
		return {
			pagesCount,
			page: +pageNumber,
			pageSize: +pageSize,
			totalCount,
			items: blogs.map(userMapper),
		};
	}
	static async findUserById(id: string): Promise<UserDBType | null> {
		let product = await userCollection.findOne({ _id: new ObjectId(id) });
		if (product) {
			return product;
		} else {
			return null;
		}
	}
	static async findByLoginOrEmail(loginOrEmail: string) {
		const user = await userCollection.findOne({
			$or: [{ email: loginOrEmail }, { login: loginOrEmail }],
		});
		return user;
	}
}
