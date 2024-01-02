export type CreateBlogModel = {
	name: string;
	description: string;
	websiteUrl: string;
	createdAt: string;
	isMembership: true;
};

export type UpdateBlogModel = {
	name: string;
	description: string;
	websiteUrl: string;
};
