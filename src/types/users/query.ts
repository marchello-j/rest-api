export type QueryUsersInput = {
	searchLoginTerm?: string;
	searchEmailTerm?: string;
	sortBy?: string;
	sortDirection?: string;
	pageNumber?: number;
	pageSize?: number;
};
