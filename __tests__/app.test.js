const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  email: 'testemail@test.com',
  username: 'testUser',
  password: '123456'
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });
  it('#POST /api/v1/users creates and signs in a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { email, username } = mockUser;
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Signed in successfully',
      user: {
        id: expect.any(String),
        email,
        username
      }
    });
  });
  it('#POST /api/v1/users/sessions signs in an existing user', async () => {
    await request(app).post('/api/v1/users')
      .send(mockUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ username: 'testUser', password: '123456' });
    expect(res.status).toBe(200);
  });
});
