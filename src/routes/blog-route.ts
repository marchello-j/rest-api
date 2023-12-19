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
export const blogRoute = Router();

blogRoute.get('/', (req: Request, res: Response<BlogModel[]>) => {
	const blogs = BlogRepository.getAllBlogs();
	return res.send(blogs);
});

blogRoute.get('/:id', (req: RequestWithParams<Params>, res: Response<null | BlogModel>) => {
	const id = req.params.id;
	const blog = BlogRepository.getBlogById(id);
	if (!blog) {
	return	res.sendStatus(404);
	}
	return res.status(200).send(blog);
});

blogRoute.post(
	'/',
	authMiddleware,
	blogValidation(),
	(req: RequestWithBody<CreateBlogModel>, res: Response<BlogModel>) => {
		const inputDto = req.body;
		const blog = BlogRepository.createBlog(inputDto);
		return res.status(201).send(blog);
	}
);

blogRoute.put(
	'/:id',
	authMiddleware,
	blogValidation(),
	(req: RequestWithBodyAndParams<Params, UpdateBlogModel>, res: Response<void>): void => {
		const id = req.params.id;
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
	(req: RequestWithParams<Params>, res: Response<void>): void => {
		const isDeleted = BlogRepository.deleteBlog(req.params.id);
		if (isDeleted) {
			 res.sendStatus(204);
			 return;
		}		
		res.sendStatus(404);
		return;
	}
);
