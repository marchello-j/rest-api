import request from 'supertest';
import { app } from '../src/settings';
import { PostModel } from '../src/types/post/output';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
describe('/posts', () => {
	const client = new MongoClient(url);
	beforeAll(async () => {
		await client.connect();
	});

	afterAll(async () => {
		await client.close();
	});
	let blogId: any;

	let newPost: PostModel | null;
	it('Create blog id', async () => {
		await request(app).post('/blogs').auth('admin', 'qwerty').send({
			name: 'Hello Title',
			description: 'Hello Author',
			websiteUrl: 'https://fadfamssDSS-amdfasd-adfmasdf',
		});
		const result = await request(app).get('/blogs');
		blogId = result.body[0].id;
		console.log(blogId, 'Blog ID');
	});
	it('GET post = []', async () => {
		const result = await request(app).get('/posts').expect(200);
		expect(result.body);
	});

	it('- GET post by ID with incorrect id', async () => {
		await request(app).get('/posts/12312123').expect(404);
	});
	it('+ GET post by ID with correct id', async () => {
		await request(app).get('/posts/' + newPost?.id);
	});
	it('- POST does not create the post without authorization', async function () {
		await request(app)
			.post('/posts')
			.send({
				title: 'Hello',
				shortDescription: 'My day',
				content: 'string to string about me all the time',
				blogId: blogId,
			})
			.expect(401);
	});

	it('- POST does not create the post with incorrect data (no title, no shortDescription)', async function () {
		const resault = await request(app)
			.post('/posts')
			.auth('admin', 'qwerty')
			.send({
				title: '',
				shortDescription: '',
				content: 'string to string about me all the time',
				blogId: blogId,
			})
			.expect(400);
		expect(resault.body).toEqual({ errorsMessages: expect.any(Array) });
	});
	it('+ POST create the post with correct data', async function () {
		const result = await request(app)
			.post('/posts')
			.auth('admin', 'qwerty')
			.send({
				title: 'Hello',
				shortDescription: 'My day',
				content: 'string to string about me all the time',
				blogId: blogId,
			})
			.expect(201);
		newPost = result.body;
	});

	it('+ PUT create the post with correct data', async function () {
		const result = await request(app)
			.put(`/posts/${newPost?.id}`)
			.auth('admin', 'qwerty')
			.send({
				title: 'Hello',
				shortDescription: 'My day',
				content: 'string to string about me all the time',
				blogId: blogId,
			})
			.expect(204);
	});
	it('- PUT try to update not found post', async function () {
		await request(app)
			.put('/posts/123')
			.auth('admin', 'qwerty')
			.send({
				title: 'Hello',
				shortDescription: 'My day',
				content: 'string to string about me all the time',
				blogId: blogId,
			})
			.expect(404);
	});
	it('+ DELETE post by ID with correct id', async () => {
		await request(app)
			.delete(`/posts/${newPost?.id}`)
			.auth('admin', 'qwerty')
			.expect(204);
	});

	it('- DELETE post by ID with incorrect id', async () => {
		await request(app).delete('/post/4783645').auth('admin', 'qwerty');
	});
});
