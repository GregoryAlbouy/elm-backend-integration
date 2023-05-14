import server from "fastify";

import { Elm } from "./Main.elm";

const initElm = (environment = "development") =>
  Elm.Main.init({ flags: { environment } });

const elmApp = initElm(process.env.NODE_ENV);
const store = { count: 0 };

server()
  .get("/ping", async () => {
    elmApp.ports.pingReceiver.send(null);
    return { pong: store.count };
  })
  .listen({ port: 8080 }, (err, address) => {
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
