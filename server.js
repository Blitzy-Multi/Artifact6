'use strict';

/**
 * Minimal Express.js HTTP server for the Artifact6 tutorial project.
 *
 * Exposes two static GET endpoints:
 *   - GET /              -> "Hello world"  (R3: baseline preserved)
 *   - GET /good-evening  -> "Good evening" (R2: new endpoint)
 *
 * Security defaults (AAP 0.5.1 / 0.5.3):
 *   - X-Powered-By header is disabled so the server does not advertise the
 *     framework (OWASP A05: Security Misconfiguration).
 *   - Responses are literal strings only; no user input is parsed, reflected,
 *     stored, or redirected, so injection / XSS / open-redirect code paths are
 *     never reached.
 *   - Unknown routes fall through to Express's built-in default 404 handler,
 *     which does not leak stack traces or internal detail.
 *
 * CommonJS module (package.json does not declare "type": "module").
 */

const express = require('express');

// Instantiate the Express application.
const app = express();

// Security hardening (OWASP A05): do not advertise the framework via the
// X-Powered-By response header. Applied before any route is registered.
app.disable('x-powered-by');

// R3 - baseline endpoint preserved: GET / returns exactly "Hello world".
app.get('/', (req, res) => {
  res.send('Hello world');
});

// R2 - new endpoint: GET /good-evening returns exactly "Good evening".
app.get('/good-evening', (req, res) => {
  res.send('Good evening');
});

// Bind the listen port from the environment, defaulting to 3000 for the
// tutorial. No other configuration is read.
const PORT = process.env.PORT || 3000;

// Start the HTTP listener.
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
