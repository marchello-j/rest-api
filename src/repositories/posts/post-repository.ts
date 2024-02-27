import { CreatePostModel, UpdatePostModel } from '../../types/posts/input'
import { PostModel } from '../../types/posts/output'
import { postCollection } from '../../db/db'
import { ObjectId } from 'mongodb'

export class PostRepository {
	static async createPost(newPost: CreatePostModel): Promise<PostModel | null> {
		const addNewPost = await postCollection.insertOne({ ...newPost })
		return {
			...newPost,
			id: addNewPost.insertedId.toString()
		}
	}
	static async updatePost(id: string, body: UpdatePostModel): Promise<boolean> {
		const updateResult = await postCollection.updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					title: body.title,
					shortDescription: body.shortDescription,
					content: body.content,
					blogId: body.blogId
				}
			}
		)
		return !!updateResult.matchedCount
	}
	static async deletePost(id: string): Promise<boolean> {
		const post = await postCollection.deleteOne({ _id: new ObjectId(id) })
		if (!ObjectId.isValid(id)) {
			return false
		}
		return !!post.deletedCount
	}
}
