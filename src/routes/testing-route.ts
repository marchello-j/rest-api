import { Router, Request, Response } from 'express';
import { blogCollection, postCollection, userCollection } from '../db/db';

export const deleteAllDataRoute = Router({});

deleteAllDataRoute.delete('/', async (req: Request, res: Response) => {
	console.log('Route working');
	await blogCollection.deleteMany({});
	await postCollection.deleteMany({});
	await userCollection.deleteMany({});
	res.sendStatus(204);
});
