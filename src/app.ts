import server from "fastify";

import { Elm } from "./elm.js"; // not found? run `npm run build:elm`

type MyElmApp = ElmApp<{
  pingReceiver: PortToElm<null>;
  sendPong: PortFromElm<number>;
}>;

const initElm = (environment = "development") => {
  const elmApp: MyElmApp = Elm.Main.init({ flags: { environment } });
  const state = { count: 0 };

  elmApp.ports.sendPong.subscribe((count) => {
    console.log(`Pong from Elm: ${count}`);
    state.count = count;
  });

  return {
    pingElm: () => {
      elmApp.ports.pingReceiver.send(null);
      return state.count;
    },
  };
};

const { pingElm } = initElm(process.env.NODE_ENV);

server()
  .get("/ping", async () => ({ pong: pingElm() }))
  .listen({ port: 8080 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
