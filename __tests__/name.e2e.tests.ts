import request from 'supertest';
import { app } from '../src/settings';
import dotenv from 'dotenv';
dotenv.config();

import { VideoType } from '../src/settings';

describe('/videos', () => {
	let newVideo: VideoType | null = null;
	beforeAll(async () => {
		await request(app).delete('/testing/all-data').expect(204);
	});
	it('GET video = []', async () => {
		const result = await request(app).get('/videos').expect(200);
		expect(result.body).toEqual([
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
		]);
	});
	it('- GET video by ID with incorrect id', async () => {
		await request(app).get('/videos/12312123').expect(404);
	});
	it('+ GET product by ID with correct id', async () => {
		await request(app).get('/videos/' + newVideo?.id);
	});
	it('- POST does not create the video with incorrect data (no title, no author)', async function () {
		await request(app)
			.post('/videos')
			.send({ title: '', author: '', availableResolutions: ['P144'] })
			.expect(400, {
				errorMessages: [
					{ message: 'Invalid title', field: 'title' },
					{ message: 'Invalid author', field: 'author' },
				],
			});
	});
	it('+ POST create the video with correct data', async function () {
		const result = await request(app)
			.post('/videos')
			.send({
				title: 'Hello Title',
				author: 'Hello Author',
				availableResolutions: ['P144'],
			})
			.expect(201);
		newVideo = result.body;
	});

	it('+ PUT create the video with correct data', async function () {
		console.log('New video', newVideo);
		await request(app)
			.put(`/videos/${newVideo?.id}`)
			.send({
				title: 'Hello Title',
				author: 'Hello Author',
				availableResolutions: ['P144'],
				canBeDownloaded: false,
				minAgeRestriction: 1,
				publicationDate: '2023-12-05T08:47:22.152Z',
			})
			.expect(204);
	});
	it('+ DELETE video by ID with correct id', async () => {
		await request(app).delete('/videos/1').expect(204);
	});

	it('+ DELETE video by ID with incorrect id', async () => {
		await request(app).delete('/videos/4783645');
	});

	it('+ PUT create the video with correct data', async function () {
		await request(app)
			.put(`/videos/${newVideo?.id}`)
			.send({
				title: 'Hello Title',
				author: 'Hello Author',
				availableResolutions: ['P144'],
				canBeDownloaded: false,
				minAgeRestriction: 1,
				publicationDate: '2023-12-05T08:47:22.152Z',
			})
			.expect(404);
	});
});
