import { CommentsModel } from '../../types/comments/output'
import { commentsCollection } from '../../db/db'
import { CreateCommentsModel } from '../../types/comments/input'
import { ObjectId } from 'mongodb'

export class CommentsRepository {
	static async createComment(
		newComment: CreateCommentsModel
	): Promise<CommentsModel> {
		const comment = await commentsCollection.insertOne({ ...newComment })
		return {
			...newComment,
			id: comment.insertedId.toString()
		}
	}
	static async deleteComment(id: string): Promise<boolean> {
		const comment = await commentsCollection.deleteOne({
			_id: new ObjectId(id)
		})
		if (!ObjectId.isValid(id)) {
			return false
		}
		return !!comment.deletedCount
	}
	static async updateComment(id: string, content: string): Promise<boolean> {
		if (!ObjectId.isValid(id)) return false
		const comment = await commentsCollection.updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					content: content
				}
			}
		)

		return !!comment.matchedCount
	}
}
