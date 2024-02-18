import { feedbackCollection } from '../../db/db'
import { ObjectId } from 'mongodb'

export class FeedbackRepository {
	static async sendFeedbacks(comment: string, userId: ObjectId) {
		return await feedbackCollection.find({})
	}
}
