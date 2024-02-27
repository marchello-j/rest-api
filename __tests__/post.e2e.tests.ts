import request from 'supertest'
import { app } from '../src/settings'
import { PostModel } from '../src/types/posts/output'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import { BlogModel } from '../src/types/blogs/output'
import { HTTP_STATUSES } from '../src/uitls/utils'

dotenv.config()
const url = process.env.MONGO_URL || 'mongodb://localhost:27017'
describe('/posts', () => {
	const client = new MongoClient(url)
	let newBlog: BlogModel | null

	beforeAll(async () => {
		await client.connect()
	})

	afterAll(async () => {
		await client.close()
	})
	afterAll((done) => done())
	let blogId: any

	let newPost: PostModel | null
	it('Create post', async () => {
		await request(app).post('/blogs').auth('admin', 'qwerty').send({
			name: 'Hello Title',
			description: 'Hello Author',
			websiteUrl: 'https://fadfamssDSS-amdfasd-adfmasdfdfdss',
			blogId: blogId
		})
		blogId = await request(app).get('/blogs/' + newBlog?.id)
	})
	it('GET post = []', async () => {
		const result = await request(app).get('/posts').expect(HTTP_STATUSES.OK_200)
		expect(result.body)
	})

	it('- GET post by ID with incorrect id', async () => {
		await request(app)
			.get('/posts/123121232314567894582134')
			.expect(HTTP_STATUSES.NOT_FOUND_404)
	})
	it('- POST does not create the post without authorization', async function () {
		await request(app)
			.post('/posts')
			.send({
				title: 'Hello',
				shortDescription: 'My day',
				content: 'string to string about me all the time',
				blogId: blogId
			})
			.expect(HTTP_STATUSES.UNAUTHORAIZED_401)
		blogId = await request(app).get('/blogs/' + newPost?.id)
	})

	it('- POST does not create the post with incorrect data (no title, no shortDescription)', async function () {
		const resault = await request(app)
			.post('/posts')
			.auth('admin', 'qwerty')
			.send({
				title: '',
				shortDescription: '',
				content: 'string to string about me all the time',
				blogId: blogId
			})
			.expect(HTTP_STATUSES.BAD_REQUEST_400)
		expect(resault.body).toEqual({ errorsMessages: expect.any(Array) })
	})
	it('+ GET post by ID with correct id', async () => {
		await request(app).get('/posts/' + newPost?.id)
	})

	it('+ PUT create the post with correct data', async function () {
		blogId = await request(app).get('/blogs/' + newBlog?.id)
		await request(app)
			.put(`/posts/${newPost?.id}`)
			.auth('admin', 'qwerty')
			.send({
				title: 'Hello',
				shortDescription: 'My day df sdf  asdf a da ',
				content: 'string to string about me all the time',
				blogId: blogId
			})
			.expect(HTTP_STATUSES.NO_CONTENT_204)
	})
	it('- PUT try to update not found post', async function () {
		await request(app)
			.put('/posts/asdfasd')
			.auth('admin', 'qwerty')
			.send({
				title: 'Hello',
				shortDescription: 'My day',
				content: 'string to string about me all the time',
				blogId: ''
			})
			.expect(HTTP_STATUSES.NOT_FOUND_404)
	})
	it('+ DELETE post by ID with correct id', async () => {
		await request(app)
			.delete(`/posts/${newPost?.id}`)
			.auth('admin', 'qwerty')
			.expect(HTTP_STATUSES.NO_CONTENT_204)
	})

	it('- DELETE post by ID with incorrect id', async () => {
		await request(app)
			.delete('/posts/123456789123456789123456')
			.auth('admin', 'qwerty')
			.expect(HTTP_STATUSES.NOT_FOUND_404)
	})
})
