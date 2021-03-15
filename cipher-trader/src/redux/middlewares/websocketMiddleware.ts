import {MiddlewareAPI} from 'redux';
import {Binance} from './binance';
import {Bitmex} from './bitmex';
import {Bybit} from './bybit';

export function initializeWebsocketMiddleware() {
  const socket = new Socket();

  const handlers = {
    connect: socket.connect,
    send: socket.send,
    disconnect: socket.disconnect,
    setActiveExchange: socket.setActiveExchange,
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
  public activeExchange: 'bitmex' | 'binance' | 'bybit' = 'bitmex';

  public bitmex: Bitmex;
  public binance: Binance;
  public bybit: Bybit;

  constructor() {
    this.bitmex = new Bitmex();
    this.binance = new Binance();
    this.bybit = new Bybit();
  }

  connect = (store: MiddlewareAPI, payload: any) => {
    console.log('CONNECTING', this.activeExchange);
    try {
      // this.bitmex.connect();
      this[this.activeExchange].connect();

      // this.listenTrades(store);
      // this.listenInstrument(store);
      // this.listenOnOpen(store);
      // this.listenOrders(store);

      this[this.activeExchange].on('open', () => {
        console.log('BINANCE CONNECTED OPEN');
        store.dispatch({type: 'connected', payload: 'connected'});
      });

      this[this.activeExchange].on('trades', (event) => {
        console.log('BINANCEEVENT: ', event);
        //@ts-ignore
        store.dispatch({type: 'trades', payload: event?.[0]?.price});
      });
    } catch (err) {
      console.log('AAAAAAAAA SOCKET ERR', err);
    }
  };

  disconnect = (store: MiddlewareAPI, payload: any) => {
    console.log('DISCONNECTING');
    this[this.activeExchange].disconnect();
  };

  send = (store: MiddlewareAPI, payload: any) => {
    console.log('ME SEND');
    this.bybit.send(payload);
  };

  setActiveExchange = (store: MiddlewareAPI, payload: any) => {
    this[this.activeExchange].api?.close();
    this.activeExchange = payload;
    this.connect(store, {});
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
