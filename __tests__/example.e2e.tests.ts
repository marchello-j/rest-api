import request from 'supertest';
import { RouterPaths, app } from '../src/settings';
import { MongoClient } from 'mongodb';
import {HTTP_STATUSES} from '../src/uitls/utils'
import dotenv from 'dotenv';

dotenv.config();

const dbName = 'hw';
const url = process.env.MONGO_URL || `mongodb://localhost:27017${dbName}`;
describe('test for /users', () => {
  beforeAll(async() => {
    const client = new MongoClient(url);
    beforeAll(async () => {
      await client.connect();
    });
    afterAll(async () => {
      await client.close();
    });

    afterAll((done) => done());
  })

  it('should return 200 and empty array',async () => {
    await request(app).get(RouterPaths.blogs).expect(HTTP_STATUSES.OK_200, [])
  })

  it("should't create course with incorrect input data",async () => {
    await request(app).get(RouterPaths.blogs + '/1').expect(HTTP_STATUSES.NOT_FOUND_404)

  })

})