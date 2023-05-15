declare module "*.elm" {
  export const Elm: ElmInstance<MyElmPorts>;
}

type MyElmPorts = {
  pingReceiver: PortToElm<null>;
  sendPong: PortFromElm<number>;
};
