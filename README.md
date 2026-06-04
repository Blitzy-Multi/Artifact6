# Artifact6

A minimal Node.js + Express.js tutorial server exposing two HTTP `GET` endpoints.

## Prerequisites

- Node.js version 18 or higher (Express 5 requires Node.js 18+).

## Setup

Install the dependencies:

```bash
npm install
```

## Run

Start the server:

```bash
npm start
```

This is equivalent to running `node server.js`. The server listens on port `3000` by default; set the `PORT` environment variable to use a different port.

## Endpoints

- `GET /` responds with `Hello world`
- `GET /good-evening` responds with `Good evening`

Example requests:

```bash
curl http://localhost:3000/
curl http://localhost:3000/good-evening
```
