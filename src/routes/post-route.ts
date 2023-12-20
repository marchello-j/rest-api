import { Router, Request, Response } from 'express';
import { PostRepository } from '../repositories/post-repository';
import {
	Params,
	RequestWithBody,
	RequestWithBodyAndParams,
	RequestWithParams,
} from '../types/common';
import { PostModel } from '../types/post/output';
import { authMiddleware } from '../middleware/auth/auth-middleware';
import { postValidation } from '../validators/post-validattion';
import { CreateBlogModel } from '../types/blog/input';
import { CreatePostModel, UpdatePostModel } from '../types/post/input';

export const postRoute = Router();

postRoute.get('/', (req: Request, res: Response) => {
	const posts = PostRepository.getAllPosts();
	res.send(posts);
});

postRoute.get(
	'/:id',
	(req: RequestWithParams<Params>, res: Response<null | PostModel>) => {
		const id = req.params.id;
		const post = PostRepository.getPostById(id);
		if (!post) {
			return res.sendStatus(404);
		}
		return res.status(200).send(post);
	}
);

postRoute.post(
	'/',
	authMiddleware,
	postValidation(),
	(req: RequestWithBody<CreatePostModel>, res: Response<PostModel>) => {
		const newPost = req.body;

		const post = PostRepository.createPost(newPost);
		return res.status(201).send(post);
	}
);

postRoute.put(
	'/:id',
	authMiddleware,
	postValidation(),
	(
		req: RequestWithBodyAndParams<Params, UpdatePostModel>,
		res: Response<void>
	): void => {
		const id = req.params.id;
		const resault = PostRepository.updatePost(id, req.body);
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
	(req: RequestWithParams<Params>, res: Response<void>): void => {
		const isDeleted = PostRepository.deletePost(req.params.id);
		if (isDeleted) {
			res.sendStatus(204);
			return;
		}
		res.sendStatus(404);
		return;
	}
);
