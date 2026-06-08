# Artifact6

A minimal **Node.js + Express 5** tutorial server that exposes two static `GET`
endpoints. It has no database and no external dependencies, so it is small enough
to read in one sitting, run locally, and test end to end.

## Endpoints

| Method | Path | Status | Response body | Content-Type |
| --- | --- | --- | --- | --- |
| `GET` | `/` | `200` | `Hello world` | `text/html; charset=utf-8` |
| `GET` | `/good-evening` | `200` | `Good evening` | `text/html; charset=utf-8` |

Any unknown route, or a non-`GET` method on one of these routes, falls through to
Express's default `404` handler.

## Prerequisites

- Node.js 18 or higher (tested on Node.js 20.x LTS).
- npm (bundled with Node.js).

## Setup

Install the dependencies:

```bash
npm install
```

## Running the server

Start the server:

```bash
npm start
```

This runs `node server.js`. By default the server listens on port `3000` and logs
`Server listening on port 3000`.

To listen on a different port, set the `PORT` environment variable:

```bash
PORT=4011 npm start
```

## Trying the endpoints

With the server running, call each endpoint with `curl`:

```bash
curl http://localhost:3000/
# Hello world

curl http://localhost:3000/good-evening
# Good evening
```

If you started the server with `PORT=4011`, use `http://localhost:4011` instead.

## Project structure

```
.
├── app.js              # Express app: builds `app`, registers the two routes, exports `app` (no app.listen)
├── server.js           # Bootstrap: require('./app') + app.listen(PORT)
├── package.json        # Scripts, dependencies, and Jest configuration
└── __tests__/
    └── app.test.js     # Supertest suite: both endpoints + routing/error behavior
```

`app.js` exports the configured Express `app` without calling `app.listen()`;
`server.js` owns the listening socket. This separation lets the test suite drive
the app in-process on an ephemeral port.

## Testing

The project ships with a Jest + Supertest test suite. Run it with:

```bash
npm test
```

Measure coverage with:

```bash
npm run test:coverage
```

See [TESTING.md](TESTING.md) for the full testing guide — stack, layout, coverage
policy, and CI usage.

## License

Released under the MIT License.
