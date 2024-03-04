import { Request, Response, Router } from 'express'
import {
	blogCollection,
	commentsCollection,
	postCollection,
	userCollection
} from '../db/db'
import { HTTP_STATUSES } from '../uitls/utils'

export const deleteAllDataRoute = Router({})

deleteAllDataRoute.delete('/', async (req: Request, res: Response) => {
	console.log('Route working')
	await blogCollection.deleteMany({})
	await postCollection.deleteMany({})
	await userCollection.deleteMany({})
	await commentsCollection.deleteMany({})

	res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
