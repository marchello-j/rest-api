import { randomUUID } from 'crypto';
import { db } from '../db/db';
import { CreateBlogModel, UpdateBlogModel } from '../types/blog/input';
import { BlogModel } from '../types/blog/output';

export class BlogRepository {
	static getAllBlogs() {
		return db.blogs;
	}
	static getBlogById(id: string) {
		return db.blogs.find((b) => b.id === id);
	}

	static createBlog(body: CreateBlogModel):BlogModel {
		const newBlog = {
			id: randomUUID(),
			name: body.name,
			description: body.description,
			websiteUrl: body.websiteUrl,
		};
		db.blogs.push(newBlog);
		return newBlog;
	}

	static updateBlog(id: string, body: UpdateBlogModel) {
		const blog = db.blogs.find((b) => b.id === id);

		if (!blog) {
			return false;
		}
		blog.name = body.name;
		blog.description = body.description;
		blog.websiteUrl = body.websiteUrl;

		return true;
	}

	static deleteBlog(id: string) {
		for (let i = 0; i < db.blogs.length; i++) {
			if (db.blogs[i].id === id) {
				db.blogs.splice(i, 1);
				return true;
			}
		}
		return false;
	}
}
