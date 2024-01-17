import { Router, Request, Response } from 'express';
import { BlogRepository } from '../repositories/blog-repository';
import {
	RequestWithParams,
	RequestWithBody,
	RequestWithBodyAndParams,
	RequestWithQuery,
	RequestWithQueryAndParams,
} from '../types/common';
import { Params } from '../types/common';
import { authMiddleware } from '../middleware/auth/auth-middleware';
import { blogValidation } from '../validators/blog-validator';
import { CreateBlogModel, CreatePostBlogModel, UpdateBlogModel } from '../types/blogs/input';
import { BlogModel } from '../types/blogs/output';
import { QueryBlogInput } from '../types/blogs/query';
import { ResponseBlogModel } from '../types/blogs/output';
import { validationForBlogInPost } from '../validators/validationForBlogInPost';
import { PostRepository } from '../repositories/post-repository';
import { PostModel } from '../types/posts/output';
import { ResponsePostModel } from '../types/posts/output';
import { BlogQueryRepository } from '../repositories/blog-query-repository';
import { BlogService } from '../domain/blogs-service';
import { PostQueryRepository } from '../repositories/post-query-repository';

export const blogRoute = Router();

blogRoute.get(
	'/',
	async (req: RequestWithQuery<QueryBlogInput>, res: Response<ResponseBlogModel>) => {
		const sortData = {
			searchNameTerm: req.query.searchNameTerm,
			sortBy: req.query.sortBy,
			sortDirection: req.query.sortDirection,
			pageNumber: req.query.pageNumber,
			pageSize: req.query.pageSize,
		};
		const blogs = await BlogQueryRepository.getAllBlogs(sortData);

		return res.send(blogs);
	}
);

blogRoute.get('/:id', async (req: RequestWithParams<Params>, res: Response<null | BlogModel>) => {
	const id = req.params.id;
	const blog = await BlogQueryRepository.getBlogById(id);
	if (!blog) {
		return res.sendStatus(404);
	}
	return res.status(200).send(blog);
});

blogRoute.post(
	'/',
	authMiddleware,
	blogValidation(),
	async (req: RequestWithBody<CreateBlogModel>, res: Response<BlogModel>) => {
		const inputDto = req.body;
		const blog = await BlogService.addBlog(inputDto);
		if (!blog) {
			return res.sendStatus(400);
		}
		return res.status(201).send(blog);
	}
);

blogRoute.post(
	'/:id/posts',
	authMiddleware,
	validationForBlogInPost(),
	async (req: RequestWithBodyAndParams<Params, CreatePostBlogModel>, res: Response<PostModel>) => {
		const { title, shortDescription, content } = req.body;
		const blogId = req.params.id;
		const newPost = await BlogService.addPostToBlog(blogId, { title, shortDescription, content });

		if (!newPost) {
			res.sendStatus(404);
			return;
		}
		return res.status(201).send(newPost);
	}
);

blogRoute.get(
	'/:id/posts',
	async (
		req: RequestWithQueryAndParams<Params, QueryBlogInput>,
		res: Response<ResponsePostModel>
	) => {
		const sortData = {
			searchNameTerm: req.query.searchNameTerm,
			sortBy: req.query.sortBy,
			sortDirection: req.query.sortDirection,
			pageNumber: req.query.pageNumber,
			pageSize: req.query.pageSize,
		};
		const blogId = req.params.id;

		const blog = await BlogQueryRepository.getBlogById(blogId);
		if (!blog) {
			res.sendStatus(404);
			return;
		}
		const postInBlog = await BlogQueryRepository.getAllPostsInBlog(sortData, blogId);

		return res.status(200).send(postInBlog);
	}
);

blogRoute.put(
	'/:id',
	authMiddleware,
	blogValidation(),
	async (req: RequestWithBodyAndParams<Params, UpdateBlogModel>, res: Response<void>) => {
		const id = req.params.id;
		const { name, description, websiteUrl } = req.body;
		const updateResult = await BlogService.updatePostToBlog(id, { name, description, websiteUrl });

		if (!updateResult) {
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
		const blog = await BlogQueryRepository.getBlogById(id);
		if (!blog) {
			return res.sendStatus(404);
		}
		await BlogRepository.deleteBlog(id);
		res.sendStatus(204);
		return;
	}
);
