import { MongoClient } from 'mongodb';
import { BlogDBType, PostDBType, UserDBType } from '../types/db/db';
import dotenv from 'dotenv'

dotenv.config();
const port: number = 3030;
const url = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017';

const client: MongoClient = new MongoClient(url);

export const dataBase = client.db('hw');

export const blogCollection = dataBase.collection<BlogDBType>('blogs');
export const postCollection = dataBase.collection<PostDBType>('posts');
export const userCollection = dataBase.collection<UserDBType>('users');

export const runDB = async () => {
	try {
		await client.connect();
		await client.db('admin').command({ ping: 1 });
		console.log('Client connected to DB');
		console.log(`DB_URL ${url}`);
		console.log(`Example app listening on port ${port}`);
	} catch (error) {
		console.log(`${error}`);
		await client.close();
	}
};
