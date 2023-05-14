import fastify from "fastify";

import { Elm } from "./elm.js"; // not found? run `npm run build:elm`

type MyElmApp = ElmApp<{
  pingReceiver: PortToElm<null>;
  sendPong: PortFromElm<number>;
}>;

function initElm(environment = "development"): MyElmApp {
  return Elm.Main.init({
    flags: { environment },
  });
}

const elmApp = initElm(process.env.NODE_ENV);
const server = fastify();
const store = {
  count: 0,
};

server.get("/ping", async (request, reply) => {
  elmApp.ports.pingReceiver.send(null);
  return `Pong: ${store.count}` + "\n";
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  elmApp.ports.sendPong.subscribe((count) => {
    console.log(`Pong from Elm: ${count}`);
    store.count = count;
  });
  console.log(`Server listening at ${address}`);
});
