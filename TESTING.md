# Testing

This project uses **[Jest](https://jestjs.io/)** as the test runner, assertion library, and coverage tool, and **[Supertest](https://github.com/forwardemail/supertest)** for HTTP-level assertions against the Express application.

## Test stack

| Tool | Version | Purpose |
| --- | --- | --- |
| Jest | ^30.4.2 | Test runner, `expect` assertions, mocking, and coverage |
| Supertest | ^7.2.2 | Issues in-process HTTP requests to the Express `app` (auto ephemeral port) |

No separate assertion or mocking library is needed — Jest provides both. There is nothing to mock: both endpoints return static strings with no database, file-system, or external-service calls.

## Layout

```
.
├── app.js              # Express app (exports `app`, no app.listen) — the module under test
├── server.js           # Bootstrap: require('./app') + app.listen(PORT)
└── __tests__/
    └── app.test.js     # Supertest suite: both endpoints + routing/error behavior
```

Test files live under `__tests__/` and are named `*.test.js` (Jest's default match).

## Testability contract

`app.js` builds the Express app and **exports it without calling `app.listen()`**. This lets the test suite import the app and drive it in-process via `request(app)`, so Supertest binds an ephemeral port automatically — no fixed `PORT`, no dangling open handles. The real listening socket is owned by `server.js`.

## Running the tests

Install dependencies first (this also installs the dev test toolchain):

```bash
npm install
```

Run the suite:

```bash
npm test
```

In CI / non-interactive environments, disable watch mode:

```bash
CI=true npm test -- --ci
```

Measure coverage:

```bash
npm run test:coverage
```

Run a single test file, or a single test by name:

```bash
npx jest __tests__/app.test.js     # one file
npx jest -t "Good evening"         # one test by name
```

Watch mode (local development only — never in CI):

```bash
npx jest --watch
```

## What is covered

For each endpoint the suite asserts the HTTP status, the **exact** response body, and the `Content-Type`:

- `GET /` → `200`, body `Hello world`, `text/html; charset=utf-8`
- `GET /good-evening` → `200`, body `Good evening`, `text/html; charset=utf-8`
- `GET /does-not-exist` → `404` (unknown route, Express default handler)
- `POST /` → `404` (no matching route + method)
- `HEAD /` → `200` (Express auto-HEAD for GET routes)

## Coverage policy

Coverage is collected only from `app.js` (`collectCoverageFrom: ["app.js"]`); the `server.js` bootstrap is excluded because binding a real port is not unit-tested. A **floor** of 80% is enforced for statements, branches, functions, and lines (`coverageThreshold.global`); the tiny two-endpoint surface reaches ~100% in practice. The floor is a minimum intended to rise as the codebase grows.

## Environment

- Node.js 18 or higher (tested on Node.js 20.x LTS).
- No environment variables and no fixed `PORT` are required for tests — Supertest uses an ephemeral port.
