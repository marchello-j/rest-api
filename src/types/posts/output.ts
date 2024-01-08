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
	sortBy?: string;
	sortDirection?: string;
	pageNumber?: number;
	pageSize?: number;
	items: PostModel[];
};
