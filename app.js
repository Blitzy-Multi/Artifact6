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
 * strings only; unknown routes fall through to Express's default 404 handler.
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

// Export the configured app WITHOUT starting a listener (R3 testability).
module.exports = app;
