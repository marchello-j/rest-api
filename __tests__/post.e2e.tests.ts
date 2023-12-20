import request from 'supertest';
import { app } from '../src/settings';
import { PostModel } from '../src/types/post/output';
describe('/posts', () => {
	let newPost: PostModel | null;
	beforeAll(async () => {
		await request(app).delete('/__tests__/').expect(404);
	});

	it('GET post = []', async () => {
		const result = await request(app).get('/posts').expect(200);
		expect(result.body).toEqual([
			{
				id: '1',
				title: 'About me',
				shortDescription: 'asfd; fasdf; ;jfasjdfad ;jewiurpq ;k ;jdfas',
				content: 'dsa ;kj;asdjf a;dkfj a;kadf ;kla',
				blogId: '1',
				blogName: 'asdfad dsafadf',
			},
		]);
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
				blogId: '123',
			})
			.expect(401);
	});

	it('- POST does not create the post with incorrect data (no title, no shortDescription)', async function () {
		const resault = await request(app)
			.post('/posts')
			.auth('admin', 'qwerty')
			.send({
				title: 'Hello',
				shortDescription: 'My day',
				content: 'string to string about me all the time',
				blogId: '123',
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
				blogId: '123',
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
				blogId: '123',
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
				blogId: '123',
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