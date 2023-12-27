import { WithId } from 'mongodb';
import { PostDBType } from '../db/db';
import { PostModel } from './output';

export const postMapper = (postDB: WithId<PostDBType>): PostModel => {
	return {
		id: postDB._id.toString(),
		title: postDB.title,
		shortDescription: postDB.shortDescription,
		content: postDB.content,
		blogId: postDB.blogId,
		blogName: postDB.blogName,
	};
};
