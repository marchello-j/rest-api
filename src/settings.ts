import express, { Request, Response } from 'express';

export const app = express();
app.use(express.json());

type RequestWithParams<P> = Request<P, {}, {}, {}>;
type RequestWithBody<B> = Request<{}, {}, B, {}>;
type RequestWithBodyAndParams<P, B> = Request<P, {}, B, {}>;

type Params = {
	id: string;
};

type CreateVideoDto = {
	title: string;
	author: string;
	availableResolutions: typeof AvailableResolutions;
};

type UpdateVideoDto = {
	title: string;
	author: string;
	availableResolutions: typeof AvailableResolutions;
	canBeDownloaded: boolean;
	minAgeRestriction: number | null;
	publicationDate: string;
};

type ErrorType = {
	errorsMessages: ErrorMessageType[];
};

type ErrorMessageType = {
	field: string;
	message: string;
};
const AvailableResolutions: string[] = [
	'P144',
	'P240',
	'P360',
	'P480',
	'P720',
	'P1080',
	'P1440',
	'P2160',
];

export type VideoType = {
	id: number;
	title: string;
	author: string;
	canBeDownloaded: boolean;
	minAgeRestriction: number | null;
	createdAt: string;
	publicationDate: string;
	availableResolutions: typeof AvailableResolutions;
};

let videos: VideoType[] = [
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
];

app.delete('/testing/all-data', (req: Request, res: Response) => {
	videos.splice(0);
	res.sendStatus(204);
});

app.get('/videos', (req: Request, res: Response): void => {
	res.send(videos);
});

app.get('/videos/:id', (req: RequestWithParams<Params>, res: Response) => {
	const id = +req.params.id;

	const video = videos.find((v) => v.id === id);

	if (!video) {
		res.sendStatus(404);
		return;
	}

	res.send(video);
});

app.post('/videos', (req: RequestWithBody<CreateVideoDto>, res: Response) => {
	const errors: ErrorType = {
		errorsMessages: [],
	};

	let { title, author, availableResolutions } = req.body;

	if (!title || title.trim().length < 1 || title.trim().length > 40) {
		errors.errorsMessages.push({ message: 'Invalid title', field: 'title' });
	}
	if (!author || author.trim().length < 1 || author.trim().length > 20) {
		errors.errorsMessages.push({ message: 'Invalid author', field: 'author' });
	}

	if (Array.isArray(availableResolutions)) {
		availableResolutions.map((r) => {
			!AvailableResolutions.includes(r) &&
				errors.errorsMessages.push({
					message: 'Invalid availableResolutions',
					field: 'availableResolutions',
				});
		});
	} else {
		errors.errorsMessages.push({
			message: 'Incorrect type',
			field: 'availableResolutions',
		});
	}

	if (errors.errorsMessages.length) {
		res.status(400).send(errors);
		return;
	}

	const createdAt = new Date();
	const publicationDate = new Date();

	publicationDate.setDate(createdAt.getDate() + 1);

	const newVideo = {
		id: +new Date(),
		canBeDownloaded: false,
		minAgeRestriction: null,
		createdAt: createdAt.toISOString(),
		publicationDate: publicationDate.toISOString(),
		title,
		author,
		availableResolutions,
	};
	videos.push(newVideo);
	res.status(201).send(newVideo);
});

app.put(
	'/videos/:id',
	(req: RequestWithBodyAndParams<Params, UpdateVideoDto>, res: Response) => {
		const id = +req.params.id;
		let errors: ErrorType = {
			errorsMessages: [],
		};

		let {
			title,
			author,
			availableResolutions,
			canBeDownloaded,
			minAgeRestriction,
			publicationDate,
		} = req.body;

		if (!title || title.trim().length < 1 || title.trim().length > 40) {
			errors.errorsMessages.push({ message: 'Invalid title', field: 'title' });
		}
		if (!author || author.trim().length < 1 || author.trim().length > 20) {
			errors.errorsMessages.push({
				message: 'Invalid author',
				field: 'author',
			});
		}

		if (Array.isArray(availableResolutions)) {
			availableResolutions.map((r) => {
				!AvailableResolutions.includes(r) &&
					errors.errorsMessages.push({
						message: 'Invalid availableResolutions',
						field: 'availableResolutions',
					});
			});
		} else {
			availableResolutions = [];
		}

		if (
			typeof canBeDownloaded !== 'undefined' &&
			typeof canBeDownloaded !== 'boolean'
		) {
			errors.errorsMessages.push({
				message: 'Invalid canBeDownloaded',
				field: 'canBeDownloaded',
			});
		}

		if (
			typeof minAgeRestriction !== 'undefined' &&
			typeof minAgeRestriction === 'number'
		) {
			minAgeRestriction < 1 ||
				(minAgeRestriction > 18 &&
					errors.errorsMessages.push({
						message: 'Invalid minAgeRestriction',
						field: 'minAgeRestriction',
					}));
		}

		if (
			typeof publicationDate !== 'undefined' &&
			typeof publicationDate !== 'string'
		) {
			errors.errorsMessages.push({
				message: 'Invalid publicationDate',
				field: 'publicationDate',
			});
		}

		if (errors.errorsMessages.length) {
			res.status(400).send(errors);
			return;
		}

		const videoIndex = videos.findIndex((v) => v.id === id);

		const video = videos.find((v) => v.id === id);

		if (!video) {
			res.sendStatus(404);
			return;
		}

		const updatedItem = {
			...video,
			title,
			author,
			canBeDownloaded: canBeDownloaded
				? canBeDownloaded
				: video.canBeDownloaded,
			minAgeRestriction: minAgeRestriction
				? minAgeRestriction
				: video.minAgeRestriction,
			availableResolutions,
			publicationDate: publicationDate
				? publicationDate
				: video.publicationDate,
		};

		videos.splice(videoIndex, 1, updatedItem);

		res.sendStatus(204);
	}
);

app.delete('/videos/:id', (req: RequestWithParams<Params>, res: Response) => {
	const id = +req.params.id;

	let video = videos.filter((v): boolean => v.id !== id);

	if (video.length < videos.length) {
		videos = video;
		res.sendStatus(204);
		return;
	} else {
		res.sendStatus(404);
		return;
	}
});
