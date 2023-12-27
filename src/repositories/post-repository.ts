import { randomUUID } from 'crypto';

import { CreatePostModel, UpdatePostModel } from '../types/post/input';
import { PostModel } from '../types/post/output';
import { BlogRepository } from './blog-repository';
import { postCollection } from '../db/db';
import { postMapper } from '../types/post/mappers';
import { ObjectId } from 'mongodb';

export class PostRepository {
	static async getAllPosts(): Promise<PostModel[]> {
		const posts = await postCollection.find({}).toArray();
		return posts.map(postMapper);
	}
	static async getPostById(id: string): Promise<PostModel | null> {
		const post = await postCollection.findOne({ _id: new ObjectId(id) });
		if (!post) {
			return null;
		}
		return postMapper(post);
	}
	static async createPost(
		createData: CreatePostModel
	): Promise<PostModel | null> {
		const blog = await BlogRepository.getBlogById(createData.blogId);
		if (!blog) {
			return null;
		}
		const newPost = {
			title: createData.title,
			shortDescription: createData.shortDescription,
			content: createData.content,
			blogId: blog.id,
			blogName: blog.name,
			createdAt: new Date().toISOString(),
		};
		const addNewPost = await postCollection.insertOne(newPost);
		return {
			...newPost,
			id: addNewPost.insertedId.toString(),
		};
	}
	static async updatePost(id: string, body: UpdatePostModel): Promise<boolean> {
		const updateResult = await postCollection.updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					title: body.title,
					shortDescription: body.shortDescription,
					content: body.content,
					blogId: body.blogId,
				},
			}
		);
		return !!updateResult.matchedCount;
	}
	static async deletePost(id: string) {
		const resDelete = await postCollection.deleteOne({ _id: new ObjectId(id) });
		return !!resDelete.deletedCount;
	}
}
