import Exchange, {BaseExchange} from './exchange';
import {ReconnectingWebSocket} from './ReconnectingWebsocket';

export class Binance extends Exchange implements BaseExchange {
  public api?: ReconnectingWebSocket;
  public endpoints: Record<string, string>;
  protected opened = false;

  constructor(private testnet = true) {
    super({id: 'binance'});

    this.endpoints = {
      PRODUCTS: 'https://api.binance.com/api/v1/ticker/allPrices',
    };
  }

  connect() {
    const url = 'wss://stream.binance.com:9443/ws/btcusdt@miniTicker';
    this.api = new ReconnectingWebSocket(url);

    this.api.onmessage = (event) => {
      console.log('on message');
      return this.queueTrades(this.formatLiveTrades(JSON.parse(event.data)));
    };
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

  send() {}

  disconnect() {
    if (this.api && this.api.readyState < 2) {
      this.api.close();
    }
    this.emitClose({});
  }

  formatLiveTrades(trade: any) {
    if (trade) {
      return [
        {
          exchange: this.id,
          //   timestamp: trade.E,
          price: (+trade.c / +trade.o) * 100 - 100,
          //   size: +trade.q,
          //   side: trade.m ? 'sell' : 'buy',
        },
      ];
    }

    return false;
  }
}
