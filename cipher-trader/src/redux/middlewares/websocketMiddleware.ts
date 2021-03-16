import {AnyAction, Dispatch, MiddlewareAPI} from 'redux';
import {AppState} from '../store/state';
import {Action, Exchange, getInstrument, noticeError, noticeOpen} from './actions';
import {Binance} from './binance';
import {Bitmex} from './bitmex';
import {Bybit} from './bybit';

type Middleware<State, _Action> = (
  store: MiddlewareAPI<Dispatch<AnyAction>, State>,
) => (next: Dispatch<AnyAction>) => (action: _Action) => _Action;

export function initializeWebsocketMiddleware() {
  const socket = new Socket();

  const handlers = {
    connect: socket.connect,
    send: socket.send,
    disconnect: socket.disconnect,
    setActiveExchange: socket.setActiveExchange,
  };

  const availableMethods = Object.keys(handlers);

  const middleware: Middleware<AppState, Action> = (store) => (next) => (action) => {
    const websocketActionType = action.type.match(/\$websocket\/(\w+)/)?.[1];
    if (websocketActionType && availableMethods.includes(websocketActionType)) {
      const handler = Reflect.get(handlers, websocketActionType);
      if (handler) {
        try {
          handler(store, action.payload);
        } catch (err) {
          noticeError(JSON.stringify(err));
        }
      }
    }

    return next(action);
  };

  return middleware;
}

class Socket {
  public activeExchange: Exchange = 'bitmex';

  public bitmex: Bitmex;
  public binance: Binance;
  public bybit: Bybit;

  constructor() {
    this.bitmex = new Bitmex();
    this.binance = new Binance();
    this.bybit = new Bybit();
  }

  connect = ({dispatch}: MiddlewareAPI, payload: any) => {
    console.log('CONNECTING', this.activeExchange);
    try {
      // this.bitmex.connect();
      this[this.activeExchange].connect();

      // this.listenTrades(store);
      // this.listenInstrument(store);
      // this.listenOnOpen(store);
      // this.listenOrders(store);

      this[this.activeExchange].on('open', () => {
        dispatch(noticeOpen());
      });

      this[this.activeExchange].on('trades', (event) => {
        console.log('BINANCEEVENT: ', event);
        dispatch({type: 'trades', payload: event?.[0]?.price});
      });
      this[this.activeExchange].on('instrument', (event) => {
        dispatch(getInstrument(event?.[0]?.price));
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
    this[this.activeExchange].send(payload);
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
