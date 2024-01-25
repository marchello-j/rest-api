import { ObjectId } from 'mongodb';
import { userCollection } from '../../db/db';
import { OutputUserModel, UsersModel } from '../../types/users/output';
import { CreateUserModel } from '../../types/users/input';
import { userMapper } from '../../types/users/mappers';

export class userRepository {
	static async createUser(newUser: OutputUserModel): Promise<UsersModel> {
		const user = await userCollection.insertOne(newUser);
		return userMapper({...newUser, _id: user.insertedId})
	}
	static async deleteUser(id: string): Promise<boolean> {
		const blog = await userCollection.deleteOne({ _id: new ObjectId(id) });
		if (!ObjectId.isValid(id)) {
			return false;
		}
		return !!blog.deletedCount;
	}
}
