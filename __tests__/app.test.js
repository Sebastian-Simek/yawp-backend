const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/middleware/UserService');

const mockUser = {
  email: 'testemail@test.com',
  username: 'testUser',
  password: '123456'
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const agent = request.agent(app);
  const user = await UserService.signUpUser({ ...mockUser, ...userProps });
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
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
        username }
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
  it('#GET /api/v1/users should return 403 for unauthorized', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/users');
    expect(res.body).toEqual({
      message: 'You are unauthorized',
      status: 403
    });
  });
});
