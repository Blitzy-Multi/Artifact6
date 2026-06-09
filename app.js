'use strict';

/**
 * Express application module for the Artifact6 tutorial project.
 *
 * Builds and exports the Express `app` WITHOUT calling app.listen(), so the
 * test suite (Supertest) can import it and drive it in-process on an ephemeral
 * port (testability requirement R3). The server bootstrap (server.js) owns the
 * real listening socket.
 *
 * Exposes two static GET endpoints:
 *   - GET /              -> "Hello world"  (R1: baseline preserved across the Express migration)
 *   - GET /good-evening  -> "Good evening" (R2: new endpoint)
 *
 * Security defaults (OWASP A05): X-Powered-By disabled; responses are literal
 * strings only; unmatched routes/methods return a generic 404 ("Not Found")
 * that does not reflect the requested path or method.
 *
 * CommonJS module (package.json does not declare "type": "module").
 */

const express = require('express');

// Instantiate the Express application.
const app = express();

// Security hardening (OWASP A05): do not advertise the framework via the
// X-Powered-By response header. Applied before any route is registered.
app.disable('x-powered-by');

// R1 - baseline endpoint preserved: GET / returns exactly "Hello world".
app.get('/', (req, res) => {
  res.send('Hello world');
});

// R2 - new endpoint: GET /good-evening returns exactly "Good evening".
app.get('/good-evening', (req, res) => {
  res.send('Good evening');
});

// Generic catch-all 404 handler, registered AFTER all routes so it runs only
// when no route/method matched. Returns a static plain-text "Not Found" body so
// that unmatched routes and methods do NOT reflect the requested path or method
// back to the client. This replaces Express's default finalhandler body
// ("Cannot GET <path>"), which echoes the request target (including any encoded
// injection/reflection payload in it). CP5 security hardening: the 404 body
// leaks no path, method, version, or stack-trace detail; the status stays 404.
app.use((req, res) => {
  res.status(404).type('text/plain').send('Not Found');
});

// Export the configured app WITHOUT starting a listener (R3 testability).
module.exports = app;
