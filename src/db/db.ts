import { MongoClient } from 'mongodb';
import { BlogDBType, DBType, PostDBType } from '../types/db/db';

const port: number = 80;
const url = process.env.MONGO_URL || 'mongodb://localhost:27017';

const client: MongoClient = new MongoClient(url);

export const dataBase = client.db('hw');

export const blogCollection = dataBase.collection<BlogDBType>('blogs');
export const postCollection = dataBase.collection<PostDBType>('posts');

export const runDB = async () => {
	try {
		await client.connect();
		console.log('Client connected to DB');
		console.log(`Example app listening on port ${port}`);
	} catch (error) {
		console.log(`${error}`);
		await client.close();
	}
};
