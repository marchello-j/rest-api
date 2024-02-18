import { Router, Request, Response } from 'express'
import { BlogRepository } from '../repositories/blogs/blog-repository'
import {
  RequestWithParams,
  RequestWithBody,
  RequestWithBodyAndParams,
  RequestWithQuery,
  RequestWithQueryAndParams
} from '../types/common'
import { Params } from '../types/common'
import { authMiddleware } from '../middleware/auth/auth-middleware'
import { blogValidation } from '../validators/blog-validator'
import {
  CreateBlogModel,
  CreatePostBlogModel,
  UpdateBlogModel
} from '../types/blogs/input'
import { BlogModel } from '../types/blogs/output'
import { QueryBlogInput } from '../types/blogs/query'
import { ResponseBlogModel } from '../types/blogs/output'
import { validationForBlogInPost } from '../validators/validationForBlogInPost'
import { PostModel } from '../types/posts/output'
import { ResponsePostModel } from '../types/posts/output'
import { BlogQueryRepository } from '../repositories/blogs/blog-query-repository'
import { BlogService } from '../domain/blogs-service'
import { HTTP_STATUSES } from '../uitls/utils'

export const blogRoute = Router()

blogRoute.get(
  '/',
  async (
    req: RequestWithQuery<QueryBlogInput>,
    res: Response<ResponseBlogModel>
  ) => {
    const sortData = {
      searchNameTerm: req.query.searchNameTerm,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize
    }
    const blogs = await BlogQueryRepository.getAllBlogs(sortData)

    return res.send(blogs)
  }
)

blogRoute.get(
  '/:id',
  async (req: RequestWithParams<Params>, res: Response<null | BlogModel>) => {
    const id = req.params.id
    const blog = await BlogQueryRepository.getBlogById(id)
    if (!blog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    return res.status(HTTP_STATUSES.OK_200).send(blog)
  }
)

blogRoute.post(
  '/',
  authMiddleware,
  blogValidation(),
  async (req: RequestWithBody<CreateBlogModel>, res: Response<BlogModel>) => {
    const inputDto = req.body
    const blog = await BlogService.addBlog(inputDto)
    if (!blog) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }
    return res.status(HTTP_STATUSES.CREATED_201).send(blog)
  }
)

blogRoute.post(
  '/:id/posts',
  authMiddleware,
  validationForBlogInPost(),
  async (
    req: RequestWithBodyAndParams<Params, CreatePostBlogModel>,
    res: Response<PostModel>
  ) => {
    const { title, shortDescription, content } = req.body
    const blogId = req.params.id
    const newPost = await BlogService.addPostToBlog(blogId, {
      title,
      shortDescription,
      content
    })

    if (!newPost) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }
    return res.status(HTTP_STATUSES.CREATED_201).send(newPost)
  }
)

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
      pageSize: req.query.pageSize
    }
    const blogId = req.params.id

    const blog = await BlogQueryRepository.getBlogById(blogId)
    if (!blog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }
    const postInBlog = await BlogQueryRepository.getAllPostsInBlog(
      sortData,
      blogId
    )

    return res.status(HTTP_STATUSES.OK_200).send(postInBlog)
  }
)

blogRoute.put(
  '/:id',
  authMiddleware,
  blogValidation(),
  async (
    req: RequestWithBodyAndParams<Params, UpdateBlogModel>,
    res: Response<void>
  ) => {
    const id = req.params.id
    const { name, description, websiteUrl } = req.body
    const updateResult = await BlogService.updatePostToBlog(id, {
      name,
      description,
      websiteUrl
    })

    if (!updateResult) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)

blogRoute.delete(
  '/:id',
  authMiddleware,
  async (req: RequestWithParams<Params>, res: Response<void>) => {
    const id = req.params.id
    const blog = await BlogQueryRepository.getBlogById(id)
    if (!blog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    await BlogRepository.deleteBlog(id)
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return
  }
)
