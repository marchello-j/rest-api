import { WithId } from 'mongodb'
import { CommentsDBType } from '../db/db'
import { CommentsModel } from './output'

export const commentMapper = (
	commentsDB: WithId<CommentsDBType>
): CommentsModel => {
	return {
		id: commentsDB._id.toString(),
		content: commentsDB.content,
		commentatorInfo: {
			userId: commentsDB.commentatorInfo.userId,
			userLogin: commentsDB.commentatorInfo.userLogin
		},
		createdAt: commentsDB.createdAt
	}
}
