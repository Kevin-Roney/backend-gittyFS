const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/github');

describe('gitty from scratch routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('should redirect to the github oauth page upon login', async () => {
    const res = await request(app).get('/api/v1/github/login');

    expect(res.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/callback/i
    );
  });
  it('should login and redirect users to /api/v1/github/dashboard', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'fake_github_user',
      email: 'not-real@example.com',
      avatar: expect.any(String),
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });
  it('should return a list of posts for authenticated user', async () => {
    const appAgent = request.agent(app);
    const expected = 'Post 1';
    let res = await request
      .agent(app)
      .get('/api/v1/github/callback?code=42')
      .redirects(1);
    res = await appAgent
      .get('/api/v1/posts');
    console.log(res.body);
    expect(res.body[0].title).toEqual(expected);
  });
  afterAll(() => {
    pool.end();
  });
});
