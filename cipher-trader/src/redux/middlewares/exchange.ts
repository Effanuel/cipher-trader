import {EventEmitter} from 'eventemitter3';

interface ExchangeOptions {
  id: string;
}

export default class Exchange extends EventEmitter {
  public indexedProducts = [];
  public connected = false;
  public valid = false;
  public price = null;
  public error: boolean | null = null;
  public shouldBeConnected = false;
  public reconnectionDelay = 1000;
  public id: string;
  public reconnectionTimeout: any = undefined;
  public api: WebSocket | null = null;
  public connectUponCloseResolver: {
    resolve: (value?: unknown) => void;
    reject: (value?: unknown) => void;
  } | null = null;

  constructor(public options: Partial<ExchangeOptions> = {}) {
    super();
    this.id = options.id || '';
    this.valid = true;
  }

  connect(reconnection = false): boolean | Promise<any> | undefined {
    console.log('CONNECT EHANCHE', this.connected);
    if (this.connected) {
      this.disconnect();
    }

    console.log('GGGOGOG', this.valid);

    if (this.valid) {
      if (this.api) {
        console.warn('previous connection not fully closed');
        return new Promise((resolve, reject) => {
          this.connectUponCloseResolver = {resolve, reject};
          //@ts-ignore
        }).then(this.connect.bind(this));
      }

      if (this.connectUponCloseResolver) {
        this.connectUponCloseResolver.reject();
        this.connectUponCloseResolver = null;
      }

      this.shouldBeConnected = true;

      console.log(`[${this.id}] ${reconnection ? 're' : ''}connecting... `);

      return true;
    }
  }

  disconnect() {
    clearTimeout(this.reconnectionTimeout);

    this.shouldBeConnected = false;
    this.price = null;
    this.error = null;

    return true;
  }

  reconnect() {
    clearTimeout(this.reconnectionTimeout);

    if (this.connected) {
      return;
    }

    console.log(`[${this.id}] schedule reconnection (${this.reconnectionDelay} ms)`);

    this.reconnectionTimeout = setTimeout(() => {
      if (!this.connected) {
        this.connect(true);
      }
    }, this.reconnectionDelay);

    this.reconnectionDelay *= 2;
  }

  emitOpen(event: any) {
    console.log('EMIT OPEN');
    this.connected = true;
    this.error = false;

    this.reconnectionDelay = 1000;

    this.emit('open', event);
  }

  emitError(error: any) {
    this.error = error.message || 'Unknown error';

    this.emit('error');
  }

  emitClose(event: any) {
    this.connected = false;

    if (this.api) {
      this.api = null;
    }

    if (this.connectUponCloseResolver) {
      this.connectUponCloseResolver.resolve();
      this.connectUponCloseResolver = null; // delete this.connectUponCloseResolver;
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
