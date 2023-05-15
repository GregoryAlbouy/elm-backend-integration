# elm-backend-integration

Example of an Elm app integration into a Fastify server written in TypeScript.

It demonstrates how to:

- Instantiate a headless Elm app using `Platform.worker` to be used
  in any context
- Communicate with an Elm app using flags, incoming ports and outcoming ports
- Properly type an Elm app from TypeScript's perspective

## Build

The build is divided in two steps, first Elm build then TypeScript build
that imports the Elm build:

```ts
import { Elm } from "./elm.js"; // not found? run `npm run build:elm`
```

See branch
[`bundler-alternative`](https://github.com/GregoryAlbouy/elm-backend-integration/tree/bundler-alternative) (#1)
for a single-step build alternative, leveraging a bundler (`esbuild`) to allow
direct imports from Elm source files:

```ts
import { Elm } from "./Main.elm";
```

## JS interoperability

Elm's `ports` system does not allow to just call a function and expect
a return value. However it can be worked around using with a simple
encapsulation on the server side.

See branch
[`as-function`](https://github.com/GregoryAlbouy/elm-backend-integration/tree/as-function) (#2)
for a working example:

```ts
server.get("/ping", async () => ({ pong: pingElm() }));
```

## Development

### Install dependencies

```sh
npm i
npm run build:elm # Generate elm.js file that is imported from app.ts
```

### Run server

```sh
npm run start
```
