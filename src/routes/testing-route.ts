import { Router, Request, Response } from 'express';
import { blogCollection, postCollection } from '../db/db';

export const deleteAllDataRoute = Router({});

deleteAllDataRoute.delete('/', async (req: Request, res: Response) => {
	console.log('Route working');
	await blogCollection.deleteMany({});
	await postCollection.deleteMany({});
	res.sendStatus(204);
});
