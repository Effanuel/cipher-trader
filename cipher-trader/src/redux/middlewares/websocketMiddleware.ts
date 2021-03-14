import {MiddlewareAPI} from 'redux';
import {Bitmex} from './bitmex';

export function initializeWebsocketMiddleware() {
  const socket = new Socket();

  const handlers = {
    connect: socket.connect,
    send: socket.send,
    disconnect: socket.disconnect,
  };

  return (store: MiddlewareAPI) => (next: any) => (action: Action) => {
    console.log(action, 'ACTIPN');
    if (Object.keys(handlers).includes(action.type)) {
      const handler = Reflect.get(handlers, action.type);

      console.log('HANDler:: ', handler);

      if (handler) {
        try {
          handler(store, action.payload);
        } catch (err) {
          console.log(err, 'errr');
          store.dispatch({type: 'err', payload: {error: JSON.stringify(err)}});
        }
      }
    }

    return next(action);
  };
}

class Socket {
  public bitmex: Bitmex;
  constructor() {
    this.bitmex = new Bitmex();
  }

  connect = (store: MiddlewareAPI, payload: any) => {
    console.log('CONNECTING');
    this.bitmex.validatePair('XBTUSD');
    this.bitmex.connect();

    this.listenTrades(store);
    this.listenInstrument(store);
    this.listenOnOpen(store);
    this.listenOrders(store);
  };

  disconnect = (store: MiddlewareAPI, payload: any) => {
    console.log('DISCONNECTING');
    this.bitmex.disconnect();
  };

  send = (store: MiddlewareAPI, payload: any) => {
    console.log('ME SEND');
    this.bitmex.send(payload);
  };

  listenOnOpen = ({dispatch}: MiddlewareAPI) => {
    this.bitmex.on('open', () => {
      dispatch({type: 'connected', payload: 'connected'});
    });
  };

  listenTrades = ({dispatch}: MiddlewareAPI) => {
    this.bitmex.on('trades', (event) => {
      //@ts-ignore
      dispatch({type: 'trades', payload: this.bitmex.price});
    });
  };

  listenInstrument = ({dispatch}: MiddlewareAPI) => {
    this.bitmex.on('instrument', (event) => {
      console.log('DISPATCH INSTRUMENT');
      //@ts-ignore
      dispatch({type: 'instrument', payload: event});
    });
  };

  listenOrders = ({dispatch}: MiddlewareAPI) => {
    this.bitmex.on('orders', (event) => {
      console.log('DISPATCH ORDERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR');
      //@ts-ignore
      dispatch({type: 'orders', payload: event});
    });
  };
}
