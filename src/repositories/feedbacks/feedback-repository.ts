import { feedbackCollection } from '../../db/db'
import { ObjectId } from 'mongodb'

export class FeedbackRepository {
	static async sendFeedbacks(comment: string, userId: ObjectId) {
		return await feedbackCollection.find({})
	}
	static async deleteComment(id: string): Promise<boolean> {
		const comment = await feedbackCollection.deleteOne({
			_id: new ObjectId(id)
		})
		if (!ObjectId.isValid(id)) {
			return false
		}
		return !!comment.deletedCount
	}
}
