import { Response, Router } from 'express'
import { PostRepository } from '../repositories/posts/post-repository'
import {
	Params,
	RequestWithBody,
	RequestWithBodyAndParams,
	RequestWithParams,
	RequestWithQuery
} from '../types/common'
import { PostModel, ResponsePostModel } from '../types/posts/output'
import { postValidation } from '../validators/post-validattion'
import { CreatePostModel, UpdatePostModel } from '../types/posts/input'
import { QueryPostInput } from '../types/posts/query'
import { PostQueryRepository } from '../repositories/posts/post-query-repository'
import { PostService } from '../domain/post-service'
import { HTTP_STATUSES } from '../uitls/utils'
import { authBasicMiddleware } from '../middleware/auth/basic-middlware'

export const postRoute = Router()

postRoute.get(
	'/',
	async (req: RequestWithQuery<QueryPostInput>, res: Response) => {
		const sortData = {
			sortBy: req.query.sortBy,
			sortDirection: req.query.sortDirection,
			pageNumber: req.query.pageNumber,
			pageSize: req.query.pageSize
		}
		const posts: ResponsePostModel =
			await PostQueryRepository.getAllPosts(sortData)
		res.send(posts)
	}
)
postRoute.get(
	'/:id',
	async (req: RequestWithParams<Params>, res: Response<null | PostModel>) => {
		const id: string = req.params.id
		const post: PostModel | null = await PostQueryRepository.getPostById(id)
		if (!post) {
			return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
		}
		return res.status(HTTP_STATUSES.OK_200).send(post)
	}
)
postRoute.post(
	'/',
	authBasicMiddleware,
	postValidation(),
	async (req: RequestWithBody<CreatePostModel>, res: Response<PostModel>) => {
		const newPost: CreatePostModel = req.body
		const post: PostModel | null = await PostService.createPost(newPost)
		if (!post) {
			return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
		}
		return res.status(HTTP_STATUSES.CREATED_201).send(post)
	}
)
postRoute.put(
	'/:id',
	authBasicMiddleware,
	postValidation(),
	async (
		req: RequestWithBodyAndParams<Params, UpdatePostModel>,
		res: Response<void>
	) => {
		const id: string = req.params.id
		const { title, shortDescription, content, blogId } = req.body
		const result: boolean = await PostRepository.updatePost(id, {
			title,
			shortDescription,
			content,
			blogId
		})
		if (!result) {
			res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
			return
		}
		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
	}
)
postRoute.delete(
	'/:id',
	authBasicMiddleware,
	async (req: RequestWithParams<Params>, res: Response<void>) => {
		const id: string = req.params.id
		const post: PostModel | null = await PostQueryRepository.getPostById(id)
		if (!post) {
			return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
		}
		await PostRepository.deletePost(id)
		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
		return
	}
)
