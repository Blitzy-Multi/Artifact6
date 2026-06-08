'use strict';

const request = require('supertest');
const app = require('../app');

describe('Artifact6 Express application', () => {
  describe('GET / (original endpoint — regression guard)', () => {
    test('responds 200 with body exactly "Hello world"', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toBe('Hello world');
    });

    test('responds with Content-Type text/html; charset=utf-8', async () => {
      await request(app)
        .get('/')
        .expect('Content-Type', /text\/html; charset=utf-8/);
    });
  });

  describe('GET /good-evening (new endpoint)', () => {
    test('responds 200 with body exactly "Good evening"', async () => {
      const res = await request(app).get('/good-evening');
      expect(res.status).toBe(200);
      expect(res.text).toBe('Good evening');
    });

    test('responds with Content-Type text/html; charset=utf-8', async () => {
      await request(app)
        .get('/good-evening')
        .expect('Content-Type', /text\/html; charset=utf-8/);
    });
  });

  describe('Routing / error behavior', () => {
    test('GET /does-not-exist returns 404 (unknown route)', async () => {
      const res = await request(app).get('/does-not-exist');
      expect(res.status).toBe(404);
    });

    test('POST / returns 404 (no matching route + method)', async () => {
      const res = await request(app).post('/');
      expect(res.status).toBe(404);
    });

    test('HEAD / returns 200 (Express auto-HEAD for GET routes)', async () => {
      const res = await request(app).head('/');
      expect(res.status).toBe(200);
    });
  });
});
