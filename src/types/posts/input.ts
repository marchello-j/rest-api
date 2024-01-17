export type CreatePostModel = {
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
	blogName: string;
	createdAt: string;
};

export type UpdatePostModel = {
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
};
