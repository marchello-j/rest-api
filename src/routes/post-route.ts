import { Router, Request, Response } from 'express';
import { PostRepository } from '../repositories/post-repository';
import {
	Params,
	RequestWithBody,
	RequestWithBodyAndParams,
	RequestWithParams,
	RequestWithQuery,
} from '../types/common';
import { PostModel } from '../types/posts/output';
import { authMiddleware } from '../middleware/auth/auth-middleware';
import { postValidation } from '../validators/post-validattion';
import { CreateBlogModel } from '../types/blogs/input';
import { CreatePostModel, UpdatePostModel } from '../types/posts/input';
import { ObjectId } from 'mongodb';
import { QueryPostInput } from '../types/posts/query';

export const postRoute = Router();

postRoute.get('/', async (req: RequestWithQuery<QueryPostInput>, res: Response) => {
	const sortData = {
		sortBy: req.query.sortBy,
		sortDirection: req.query.sortDirection,
		pageNumber: req.query.pageNumber,
		pageSize: req.query.pageSize,
	};
	const posts = await PostRepository.getAllPosts(sortData);
	res.send(posts);
});

postRoute.get('/:id', async (req: RequestWithParams<Params>, res: Response<null | PostModel>) => {
	const id = req.params.id;

	if (!ObjectId.isValid(id)) {
		res.sendStatus(404);
	}
	const post = await PostRepository.getPostById(new ObjectId(id));
	if (!post) {
		return res.sendStatus(404);
	}
	return res.status(200).send(post);
});

postRoute.post(
	'/',
	authMiddleware,
	postValidation(),
	async (req: RequestWithBody<CreatePostModel>, res: Response<PostModel>) => {
		if (!ObjectId.isValid(req.body.blogId)) {
			res.sendStatus(404);
		}
		const newPost = req.body;
		const post = await PostRepository.createPost(newPost);
		if (!post) {
			return res.sendStatus(400);
		}
		return res.status(201).send(post);
	}
);

postRoute.put(
	'/:id',
	authMiddleware,
	postValidation(),
	async (req: RequestWithBodyAndParams<Params, UpdatePostModel>, res: Response<void>) => {
		const id = req.params.id;

		if (!ObjectId.isValid(id)) {
			res.sendStatus(404);
		}
		const resault = await PostRepository.updatePost(id, req.body);
		if (!resault) {
			res.sendStatus(404);
			return;
		}
		res.sendStatus(204);
	}
);

postRoute.delete(
	'/:id',
	authMiddleware,
	async (req: RequestWithParams<Params>, res: Response<void>) => {
		if (!ObjectId.isValid(req.params.id)) {
			res.sendStatus(404);
		}
		const isDeleted = await PostRepository.deletePost(req.params.id);
		if (isDeleted) {
			res.sendStatus(204);
			return;
		}
		res.sendStatus(404);
		return;
	}
);
