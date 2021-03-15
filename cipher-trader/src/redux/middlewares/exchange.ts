import {EventEmitter} from 'eventemitter3';
import {ReconnectingWebSocket} from './ReconnectingWebsocket';

export interface ExchangeOptions {
  id: string;
  url: string;
}

export default class Exchange extends EventEmitter {
  public price = null;
  public id: string;
  public api?: ReconnectingWebSocket;

  constructor(public options: Partial<ExchangeOptions> = {}) {
    super();
    this.id = options.id || '';
  }

  emitOpen(event: any) {
    this.emit('open', event);
  }

  emitError(error: any) {
    this.emit('error', error);
  }

  emitClose(event: any) {
    if (this.api) {
      this.api = undefined;
    }
    this.emit('close', event);
  }

  queueTrades(trades: any) {
    console.log('TRADESSSS', 'sss', trades);
    if (!trades || !trades.length) {
      return;
    }

    this.price = trades[trades.length - 1].price;

    this.emit('trades', trades);
  }

  queueInstrument(instrument: any) {
    if (!instrument || !instrument.length || !instrument?.[0].askPrice) {
      return;
    }

    this.emit('instrument', instrument);
  }

  queueOrders(orders: any) {
    console.log('ORDERSSS', orders);
    if (!orders || !orders.length) {
      return;
    }

    this.emit('orders', orders);
  }
}
