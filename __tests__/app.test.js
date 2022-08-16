const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');


const mockUser = {
  email: 'testing@test.com',
  username: 'testUser',
  password: '123456'
};

const registerAndLogin = async (userProps = {}) => {
  const { password, email } = userProps;
  const agent = request.agent(app);
  await agent.post('/api/v1/users').send(userProps);
  // const [user] = await UserService.signUpUser(userProps);
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent];
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
    const [agent] = await registerAndLogin(mockUser);
    const res = await agent.get('/api/v1/users');
    expect(res.body).toEqual({
      message: 'You are unauthorized',
      status: 403
    });
  });
  it('#GET /api/v1/users should return list of users for admin', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/users').send({ ...mockUser, email: 'admin@admin.com' });
    await agent.post('/api/v1/users/sessions').send({ ...mockUser, email: 'admin@admin.com' });
    
    const res = await agent.get('/api/v1/users');
    expect(res.body).toEqual([{ 'email': 'test@test.com', 'id': '1', 'username': 'MR. Test' }, { 'email': 'teeeest@tesasdft.com', 'id': '2', 'username': 'MRasdf. Teasdfst' }, { 'email': 'admin@admin.com', 'id': '3', 'username': 'testUser' }]);
  });
  it('#GET /api/v1/restaurants should return a list of restaurants', async () => {
    const res = await request(app).get('/api/v1/restaurants');
    expect(res.body).toEqual(expect.arrayContaining([
      {
        id: expect.any(String),
        name: expect.any(String), 
        location: expect.any(String)
      }
    ]));
  });
  it('#GET /api/v1/restaurants/:id should return a restaurant', async () => {
    const res = await request(app).get('/api/v1/restaurants/1');
    expect(res.body).toEqual({
      id: '1',
      name: 'Pok Pok',
      location: 'Portland, OR',
      reviews: [
        {
          id: '1',
          review: '5',
          detail: 'this place is great',
          user_id: '1',
          restaurant_id: '1'
        },
        {
          id: '2',
          review: '1',
          detail: 'this place is not great',
          user_id: '2',
          restaurant_id: '1'
        },
        {
          id: '4',
          review: '1',
          detail: 'I like it here',
          user_id: '1',
          restaurant_id: '1'
        },
        {
          id: '6',
          review: '4',
          detail: 'woohoo',
          user_id: '1',
          restaurant_id: '1'
        }
      ]
    });
  });
});
