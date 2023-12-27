import { BlogModel } from '../blog/output';
import { VideoType } from '../video/output';
import { PostModel } from '../post/output';

export type DBType = {
	blogs: BlogModel[];
	posts: PostModel[];
	videos: VideoType[];
};

export type BlogDBType = {
	name: string;
	description: string;
	websiteUrl: string;
};

export type PostDBType = {
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
	blogName: string;
};
