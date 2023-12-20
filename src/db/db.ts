import { DBType } from '../types/db/db';

export const db: DBType = {
	blogs: [
		{
			id: '1',
			name: 'Marsel',
			description: 'about my edication',
			websiteUrl: 'www.myedication@gmail.com',
		},
	],
	posts: [
		{
			id: '1',
			title: 'About me',
			shortDescription: 'asfd; fasdf; ;jfasjdfad ;jewiurpq ;k ;jdfas',
			content: 'dsa ;kj;asdjf a;dkfj a;kadf ;kla',
			blogId: '1',
			blogName: 'asdfad dsafadf',
		},
	],
	videos: [
		{
			id: 1,
			title: 'string',
			author: 'string',
			canBeDownloaded: true,
			minAgeRestriction: null,
			createdAt: '2023-12-05T08:47:22.152Z',
			publicationDate: '2023-12-05T08:47:22.152Z',
			availableResolutions: ['P144'],
		},
	],
};
