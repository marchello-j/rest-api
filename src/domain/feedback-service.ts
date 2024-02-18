import {FeedbackQueryRepository} from "../repositories/feedbacks/feedback-query-repository";
import {ObjectId} from "mongodb";
import {FeedbackRepository} from "../repositories/feedbacks/feedback-repository";

export  class feedbackService {
	static async allFeedbacks() {
		return FeedbackQueryRepository.getAllFeedbacks()
	}
	static async sendFeedback(comment: string, userId: ObjectId) {
		return FeedbackRepository.sendFeedbacks(comment, userId)
	}
}
