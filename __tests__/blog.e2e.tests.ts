import request from 'supertest';
import { app } from '../src/settings';
import { BlogModel } from '../src/types/blog/output';

describe('/blogs', () => {
	let newBlog: BlogModel | null;
	beforeAll(async () => {
		await request(app).delete('/__tests__/').expect(404);
	});

	it('GET blogs = []', async () => {
		const result = await request(app).get('/blogs').expect(200);
		expect(result.body).toEqual([
			{
				id: '1',
				name: 'Marsel',
				description: 'about my edication',
				websiteUrl: 'www.myedication@gmail.com',
			},
		]);
	});

	it('- GET video by ID with incorrect id', async () => {
		await request(app).get('/blogs/12312123').expect(404);
	});
	it('+ GET video by ID with correct id', async () => {
		await request(app).get('/blogs/' + newBlog?.id);
	});
	it('- POST does not create the blog without authorization', async function () {
		await request(app)
			.post('/blogs')
			.send({
				name: 'dfadf',
				description: 'sfasf',
				websiteUrl: 'http://google.com',
			})
			.expect(401);
	});

	it('- POST does not create the blog with incorrect data (no name, no description)', async function () {
		const resault = await request(app)
			.post('/blogs')
			.auth('admin', 'qwerty')
			.send({
				name: '',
				description: '',
				websiteUrl: 'http://google.com',
			})
			.expect(400);
		expect(resault.body).toEqual({ errorsMessages: expect.any(Array) });
	});
	it('+ POST create the blog with correct data', async function () {
		const result = await request(app)
			.post('/blogs')
			.auth('admin', 'qwerty')
			.send({
				name: 'Hello Title',
				description: 'Hello Author',
				websiteUrl: 'http://fadfamssDSS-amdfasd-adfmasdf',
			})
			.expect(201);
		newBlog = result.body;
	});

	it('+ PUT create the blog with correct data', async function () {
		const result = await request(app)
			.put(`/blogs/${newBlog?.id}`)
			.auth('admin', 'qwerty')
			.send({
				name: 'Hello Title',
				description: 'Hello Author',
				websiteUrl: 'http://fadfamssDSS-amdfasd-adfmasdf',
			})
			.expect(204);
	});
	it('- PUT try to update not found blog', async function () {
		await request(app)
			.put('/blogs/123')
			.auth('admin', 'qwerty')
			.send({
				name: 'Hello Title',
				description: 'Hello Author',
				websiteUrl: 'http://fadfamssDSS-amdfasd-adfmasdf',
			})
			.expect(404);
	});
	it('+ DELETE blog by ID with correct id', async () => {
		await request(app)
			.delete(`/blogs/${newBlog?.id}`)
			.auth('admin', 'qwerty')
			.expect(204);
	});

	it('- DELETE blog by ID with incorrect id', async () => {
		await request(app).delete('/blogs/4783645').auth('admin', 'qwerty');
	});
});
