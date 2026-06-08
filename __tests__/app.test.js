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
    test('GET /does-not-exist returns 404 with a generic body (no path reflection)', async () => {
      const res = await request(app).get('/does-not-exist');
      expect(res.status).toBe(404);
      // Generic body: the requested path must NOT be reflected back.
      expect(res.text).toBe('Not Found');
      expect(res.text).not.toContain('/does-not-exist');
    });

    test('POST / returns 404 with a generic body (no method/path reflection)', async () => {
      const res = await request(app).post('/');
      expect(res.status).toBe(404);
      // Generic body: neither the method nor Express's default "Cannot ..." text leaks.
      expect(res.text).toBe('Not Found');
      expect(res.text).not.toContain('Cannot');
    });

    test('HEAD / returns 200 (Express auto-HEAD for GET routes)', async () => {
      const res = await request(app).head('/');
      expect(res.status).toBe(200);
    });
  });

  // CP5 security hardening: the generic 404 handler must never reflect the
  // requested path/method or any encoded injection payload contained in it.
  // These guard against regression of the default Express finalhandler body
  // ("Cannot GET <path>") that previously echoed the request target.
  describe('Security: 404 body does not reflect the request (CP5 hardening)', () => {
    test('does not reflect an encoded SQL-injection-like path in the 404 body', async () => {
      const res = await request(app).get('/%27%20OR%201%3D1%20--');
      expect(res.status).toBe(404);
      expect(res.text).toBe('Not Found');
      expect(res.text).not.toContain('%27');
      expect(res.text).not.toContain('OR 1=1');
    });

    test('does not reflect an encoded XSS-like path in the 404 body', async () => {
      const res = await request(app).get('/%3Cscript%3Ealert(1)%3C%2Fscript%3E');
      expect(res.status).toBe(404);
      expect(res.text).toBe('Not Found');
      expect(res.text).not.toContain('script');
      expect(res.text).not.toContain('%3C');
    });
  });
});
