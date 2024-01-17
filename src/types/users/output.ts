export type UsersModel = {
	id: string;
	login: string;
	email: string;
	createdAt: string;
};

export type ResponseUsersModel = {
	pagesCount: number;
	page: number;
	pageSize: number;
	totalCount: number;
	items: UsersModel[];
};

export type OutputUserModel = {
	login: string;
	email: string;
	passwordHash: string;
	passwordSalt: string;
	createdAt: string;
}