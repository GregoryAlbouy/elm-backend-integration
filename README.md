# elm-backend-integration

Example of an Elm app integration into a Fastify server written in TypeScript.

It demonstrates how to:

- Instantiate a headless Elm app using `Platform.worker` to be used
  in any context
- Communicate with an Elm app using flags, incoming ports and outcoming ports
- Properly type an Elm app from TypeScript's perspective

See `package.json` scripts for more details about the build process.

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
