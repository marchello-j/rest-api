// import request from 'supertest';
// import { app } from '../src/settings';
// import { PostModel } from '../src/types/post/output';
// describe('/blogs', () => {
// 	let newPost: PostModel | null;
// 	beforeAll(async () => {
// 		await request(app).delete('/__tests__/').expect(404);
// 	});

// 	it('GET posts = []', async () => {
// 		const result = await request(app).get('/posts').expect(200);
// 		expect(result.body).toEqual([
// 			{
// 				id: '1',
// 				name: 'Marsel',
// 				description: 'about my edication',
// 				websiteUrl: 'www.myedication@gmail.com',
// 			},
// 		]);
// 	});

// 	it('- GET video by ID with incorrect id', async () => {
// 		await request(app).get('/blogs/12312123').expect(404);
// 	});
// 	it('+ GET video by ID with correct id', async () => {
// 		await request(app).get('/blogs/' + newPost?.id);
// 	});

// 	it('- POST does not create the blog with incorrect data (no name, no description)', async function () {
// 		await request(app)
// 			.post('/blogs')
// 			.send({
// 				name: '',
// 				description: '',
// 				websiteUrl: 'http://google.com',
// 			})
// 			.expect(401, {
// 				errorsMessages: [
// 					{ message: 'Invalid name', field: 'name' },
// 					{ message: 'Invalid description', field: 'description' },
// 				],
// 			});
// 	});
// 	it('+ POST create the blog with correct data', async function () {
// 		const result = await request(app)
// 			.post('/blogs')
// 			.send({
// 				name: 'Hello Title',
// 				description: 'Hello Author',
// 				websiteUrl: 'http://fadfamssDSS-amdfasd-adfmasdf',
// 			})
// 			.expect(201);
// 		newPost = result.body;
// 	});

// 	it('+ PUT create the blog with correct data', async function () {
// 		await request(app)
// 			.put(`/blogs/${newPost?.id}`)
// 			.send({
// 				name: 'Hello Title',
// 				description: 'Hello Author',
// 				websiteUrl: 'http://fadfamssDSS-amdfasd-adfmasdf',
// 			})
// 			.expect(204);
// 	});
// 	it('- PUT create the video with incorrect data', async function () {
// 		await request(app)
// 			.put(`/blogs/${newPost?.id}`)
// 			.send({
// 				name: 'Hello Title',
// 				description: 'Hello Author',
// 				websiteUrl: 'http://fadfamssDSS-amdfasd-adfmasdf',
// 			})
// 			.expect(404);
// 	});
// 	it('+ DELETE blog by ID with correct id', async () => {
// 		await request(app).delete(`/blogs/${newPost?.id}`).expect(204);
// 	});

// 	it('+ DELETE blog by ID with incorrect id', async () => {
// 		await request(app).delete('/blogs/4783645');
// 	});
// });
