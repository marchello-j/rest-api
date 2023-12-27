import { Router, Request, Response } from 'express';
import { blogCollection, postCollection } from '../db/db';

export const deleteAllDataRoute = Router({});

deleteAllDataRoute.delete('/', async (req: Request, res: Response) => {
	await blogCollection.deleteMany({});
	await postCollection.deleteMany({});
});
