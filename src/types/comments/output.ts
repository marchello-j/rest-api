export type CommentsModel = {
	id: string
	content: string
	commentatorInfo: {
		userId: string
		userLogin: string
	}
	createdAt: string
}

export type ResponseCommentsModel = {
	pagesCount: number
	page: number
	pageSize: number
	totalCount: number
	items: CommentsModel[]
}
