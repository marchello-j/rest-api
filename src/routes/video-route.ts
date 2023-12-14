import { Router, Request, Response } from 'express';
import { db } from '../db/db';
import { RequestWithBody } from '../types/common';
import { RequestWithParams } from '../types/common';
import { CreateVideoDto } from '../types/video/input';
import { AvailableResolutions } from '../types/video/output';
import { Params } from '../types/common';
import { ErrorType } from '../types/common';
import { RequestWithBodyAndParams } from '../types/common';
import { UpdateVideoDto } from '../types/video/input';

export const videoRoute = Router();
videoRoute.delete('/testing/all-data', (req: Request, res: Response) => {
	db.videos.splice(0);
	res.sendStatus(204);
});

videoRoute.get('/videos', (req: Request, res: Response): void => {
	res.send(db.videos);
});

videoRoute.get(
	'/videos/:id',
	(req: RequestWithParams<Params>, res: Response) => {
		const id = +req.params.id;

		const video = db.videos.find((v) => v.id === id);

		if (!video) {
			res.sendStatus(404);
			return;
		}

		res.send(video);
	}
);

videoRoute.post(
	'/videos',
	(req: RequestWithBody<CreateVideoDto>, res: Response) => {
		const errors: ErrorType = {
			errorsMessages: [],
		};

		let { title, author, availableResolutions } = req.body;

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
		db.videos.push(newVideo);
		res.status(201).send(newVideo);
	}
);

videoRoute.put(
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

		const videoIndex = db.videos.findIndex((v) => v.id === id);

		const video = db.videos.find((v) => v.id === id);

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

		db.videos.splice(videoIndex, 1);

		res.sendStatus(204);
	}
);

videoRoute.delete(
	'/videos/:id',
	(req: RequestWithParams<Params>, res: Response) => {
		const id = +req.params.id;

		let video = db.videos.filter((v): boolean => v.id !== id);

		if (video.length < db.videos.length) {
			db.videos = video;
			res.sendStatus(204);
			return;
		} else {
			res.sendStatus(404);
			return;
		}
	}
);
