import Exchange, {BaseExchange} from './exchange';
import {ReconnectingWebSocket} from './ReconnectingWebsocket';

function throttle(func: (...args: unknown[]) => void, timeFrame: number) {
  let lastTime = 0;
  return (...args: unknown[]) => {
    console.log('NOW???', lastTime);
    const now = +new Date();
    if (now - lastTime >= timeFrame) {
      func(...args);
      lastTime = now;
    }
  };
}

export class Bybit extends Exchange implements BaseExchange {
  public api?: ReconnectingWebSocket;
  public endpoints: Record<string, string>;
  protected opened = false;

  constructor(private testnet = true) {
    super({id: 'bybit'});

    this.endpoints = {
      PRODUCTS: '',
    };
  }

  connect() {
    const url = 'wss://stream-testnet.bybit.com/realtime_public';
    this.api = new ReconnectingWebSocket(url);

    this.api.onmessage = throttle((event: any) => {
      this.queueTrades(this.formatLiveTrades(JSON.parse(event.data)));
    }, 500);
    this.api.onopen = (e) => {
      console.log('on open');
      this.opened = true;
      this.emitOpen(e);
    };
    this.api.onclose = (e) => {
      console.log('ONCLOSE');
      this.opened = false;
      this.emitClose(e);
    };
    this.api.onerror = () => {
      console.log('ON ERR');
      this.emitError({message: `${this.id} disconnected`});
    };
  }

  disconnect() {
    if (this.api && this.api.readyState < 2) {
      this.api.close();
    }
    this.emitClose({});
  }

  send = (payload: any) => {
    if (this.api) {
      this?.api?.send(JSON.stringify(payload));
    } else {
      throw new Error('Socket connection not initialized. Dispatch WEBSOCKET_CONNECT first');
    }
  };

  formatLiveTrades(trade: any) {
    console.log(trade, '2222222222222222222');
    const item = trade?.data?.update?.[0]?.ask1_price_e4;
    if (item) {
      return [
        {
          exchange: this.id,
          //   timestamp: trade.E,
          price: item / 10e3,
          //   size: +trade.q,
          //   side: trade.m ? 'sell' : 'buy',
        },
      ];
    }

    return false;
  }
}
