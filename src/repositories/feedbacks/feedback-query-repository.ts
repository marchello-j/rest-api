import {feedbackCollection} from "../../db/db";


export class FeedbackQueryRepository {
	static async getAllFeedbacks() {
		return  await feedbackCollection.find({})
	}

}
