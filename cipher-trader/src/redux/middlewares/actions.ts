export type Exchange = 'bitmex' | 'binance' | 'bybit';
export type Action =
  | {type: typeof $CONNECT; payload: {meta: {exchange: Exchange}}}
  | {type: typeof $DISCONNECT; payload: undefined}
  | {type: typeof $SEND; payload: {op: 'subscribe'; args: any[]}}
  | {type: typeof $SET_ACTIVE_EXCHANGE; payload: {exchange: Exchange}}
  //
  | {type: typeof $ORDERS_DATA; payload: {data: unknown[]; meta: {exchange: Exchange}}}
  | {type: typeof $INSTRUMENT_DATA; payload: any}
  //
  | {type: typeof $OPEN; payload: undefined}
  | {type: typeof $CLOSE; payload: undefined}
  | {type: typeof $ERROR; payload: unknown};

export const $CONNECT = '$websocket/connect';
export const $DISCONNECT = '$websocket/disconnect';
export const $SEND = '$websocket/send';
export const $SET_ACTIVE_EXCHANGE = '$websocket/set_active_exchange';

export const $ORDERS_DATA = '$websocket/ORDERS_DATA';
export const $INSTRUMENT_DATA = '$websocket/INSTRUMENT_DATA';

export const $OPEN = '$websocket/OPEN';
export const $CLOSE = '$websocket/close';
export const $ERROR = '$weboscket/error';

export const connect = (exchange: Exchange): Action => ({
  type: $CONNECT,
  payload: {meta: {exchange}},
});

export const disconnect = (): Action => ({
  type: $DISCONNECT,
  payload: undefined,
});

export const send = (args: any[]): Action => ({
  type: $SEND,
  payload: {op: 'subscribe', args},
});

export const setActiveExchange = (exchange: Exchange): Action => ({
  type: $SET_ACTIVE_EXCHANGE,
  payload: {exchange},
});

export const getOrders = (data: unknown[], exchange: Exchange): Action => ({
  type: $ORDERS_DATA,
  payload: {data, meta: {exchange}},
});

export const getInstrument = (data: any): Action => ({
  type: $INSTRUMENT_DATA,
  payload: data,
});

export const noticeOpen = (): Action => ({
  type: $OPEN,
  payload: undefined,
});

export const noticeClose = (): Action => ({
  type: $CLOSE,
  payload: undefined,
});

export const noticeError = (payload: unknown): Action => ({
  type: $ERROR,
  payload,
});
