import { randomUUID } from 'crypto';
import { db } from '../db/db';
import { CreatePostModel, UpdatePostModel } from '../types/post/input';
import { PostModel } from '../types/post/output';

export class PostRepository {
	static getAllPosts() {
		return db.posts;
	}
	static getPostById(id: string) {
		return db.posts.find((b) => b.id === id);
	}
	static createPost(body: CreatePostModel): PostModel {
		const newPost = {
			id: randomUUID(),
			title: body.title,
			shortDescription: body.shortDescription,
			content: body.content,
			blogId: body.blogId,
			blogName: randomUUID(),
		};
		db.posts.push(newPost);
		return newPost;
	}

	static updatePost(id: string, body: UpdatePostModel) {
		const post = db.posts.find((p) => p.id === id);
		if (!post) {
			return false;
		}
		post.title = body.title;
		post.shortDescription = body.shortDescription;
		post.content = body.content;
		post.blogId = body.blogId;

		return true;
	}

	static deletePost(id: string) {
		for (let i = 0; i < db.posts.length; i++) {
			if (db.posts[i].id === id) {
				db.posts.splice(i, 1);
				return true;
			}
		}
		return false;
	}
}
