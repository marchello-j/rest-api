import { Router, Request, Response } from 'express';
import { BlogRepository } from '../repositories/blog-repository';
import {
	RequestWithParams,
	RequestWithBody,
	RequestWithBodyAndParams,
} from '../types/common';
import { Params } from '../types/common';
import { authMiddleware } from '../middleware/auth/auth-middleware';
import { blogValidation } from '../validators/blog-validator';
import { CreateBlogModel, UpdateBlogModel } from '../types/blog/input';
import { BlogModel } from '../types/blog/output';
import { ObjectId } from 'mongodb';

export const blogRoute = Router();

blogRoute.get('/', async (req: Request, res: Response<BlogModel[]>) => {
	const blogs = await BlogRepository.getAllBlogs();
	return res.send(blogs);
});

blogRoute.get(
	'/:id',
	async (req: RequestWithParams<Params>, res: Response<null | BlogModel>) => {
		const id = req.params.id;
		if (!ObjectId.isValid(id)) {
			res.sendStatus(404);
		}
		const blog = await BlogRepository.getBlogById(id);
		if (!blog) {
			return res.sendStatus(404);
		}
		return res.status(200).send(blog);
	}
);

blogRoute.post(
	'/',
	authMiddleware,
	blogValidation(),
	async (req: RequestWithBody<CreateBlogModel>, res: Response<BlogModel>) => {
		const inputDto = req.body;
		const blog = await BlogRepository.createBlog(inputDto);
		return res.status(201).send(blog);
	}
);

blogRoute.put(
	'/:id',
	authMiddleware,
	blogValidation(),
	(
		req: RequestWithBodyAndParams<Params, UpdateBlogModel>,
		res: Response<void>
	): void => {
		const id = req.params.id;
		if (!ObjectId.isValid(id)) {
			res.sendStatus(404);
		}
		const resault = BlogRepository.updateBlog(id, req.body);
		if (!resault) {
			res.sendStatus(404);
			return;
		}
		res.sendStatus(204);
	}
);

blogRoute.delete(
	'/:id',
	authMiddleware,
	async (req: RequestWithParams<Params>, res: Response<void>) => {
		const id = req.params.id;
		if (!ObjectId.isValid(id)) {
			res.sendStatus(404);
		}
		await BlogRepository.deleteBlog(id);
		res.sendStatus(404);
		return;
	}
);
