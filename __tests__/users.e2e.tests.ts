import request from 'supertest'
import { app } from '../src/settings'
import { MongoClient } from 'mongodb'
import { config } from 'dotenv'

config()

const dbName = 'hw'
const url = process.env.MONGO_URL || `mongodb://localhost:27017${dbName}`
describe('/users', () => {
	const client = new MongoClient(url)
	beforeAll(async () => {
		await client.connect()
	})
	afterAll(async () => {
		await client.close()
	})
	afterAll((done) => done())

	it('GET users = {}', async () => {
		const res = await request(app)
			.get('/users/')
			.auth('admin', 'qwerty')
			.expect({})
		console.log(res.body)
	})
})
