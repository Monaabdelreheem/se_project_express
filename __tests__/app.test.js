
/* eslint-env jest */
const request = require('supertest');
const app = require('../app');

describe('Basic API test', () => {
  it('should return 200 for /items', async () => {
    const res = await request(app).get('/items');
    expect(res.statusCode).toBe(200);
  });
});
