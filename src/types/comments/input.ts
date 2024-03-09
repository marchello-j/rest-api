export type CreateCommentsModel = {
	postId: string
	content: string
	commentatorInfo: {
		userId: string
		userLogin: string
	}
	createdAt: string
}

export type UpdateComment = {
	content: string
}
