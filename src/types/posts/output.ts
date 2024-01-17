export type PostModel = {
	id: string;
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
	blogName: string;
	createdAt: string;
};

export type ResponsePostModel = {
	pagesCount: number;
	page: number;
	pageSize: number;
	totalCount: number;
	items: PostModel[];
};
