import { ObjectId } from 'mongodb';

export type BlogModel = {
	id: string;
	name: string;
	description: string;
	websiteUrl: string;
	createdAt: string;
	isMembership: boolean;
};

export type ResponseBlogModel = {
	pagesCount: number;
	page: number;
	pageSize: number;
	totalCount: number;
	items: BlogModel[];
};
