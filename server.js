'use strict';

/**
 * HTTP server bootstrap for the Artifact6 tutorial project.
 *
 * Imports the Express application from ./app (which builds the app and
 * registers the two GET routes but does NOT call app.listen() at import time,
 * per testability requirement R3) and binds it to a TCP port. Keeping the
 * listen call here — separate from the app definition — lets the test suite
 * import `app` and drive it in-process via Supertest on an ephemeral port,
 * with no dangling open handles.
 *
 * The PORT is read from the environment, defaulting to 3000 for the tutorial.
 *
 * CommonJS module (package.json does not declare "type": "module").
 */

const app = require('./app');

// Bind the listen port from the environment, defaulting to 3000 for the
// tutorial. No other configuration is read.
const PORT = process.env.PORT || 3000;

// Start the HTTP listener.
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
