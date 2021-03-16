//@ts-nocheck
import Exchange, {BaseExchange} from './exchange';
import {ReconnectingWebSocket} from './ReconnectingWebsocket';

export class Bitmex extends Exchange implements BaseExchange {
  private baseUrl = `${this.testnet ? 'testnet' : 'www'}.bitmex.com`;
  public api?: ReconnectingWebSocket;
  public endpoints: Record<string, string>;
  protected opened = false;

  constructor(private testnet = true) {
    super({id: 'bitmex'});

    this.endpoints = {
      PRODUCTS: `https://${this.baseUrl}/api/v1/instrument/active`,
    };
  }

  connect() {
    const url = `wss://${this.baseUrl}/realtime?subscribe=trade:XBTUSD,instrument:XBTUSD`;
    this.api = new ReconnectingWebSocket(url);

    // this.quotedInUSD = /USD$/.test(this.pair) || /^XBT/.test(this.pair);

    this.api.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.error) return this.emit('error', data.error);
        if (!data.data) return;

        switch (data?.table) {
          case 'trade':
            return this.queueTrades(this.formatLiveTrades(data));
          case 'instrument':
            return this.queueInstrument(this.formatInstrument(data));
          case 'order':
            return this.queueOrders(this.formatOrders(data));
        }
      } catch (error) {
        this.emit('error', 'Unable to parse incoming data');
      }
      return;
    };

    this.api.onopen = (e) => {
      this.opened = true;
      this.emit('open', e);
    };

    this.api.onclose = (e) => {
      this.opened = false;
      this.emitClose(e);
    };

    this.api.onerror = (error) => {
      this.emitError(error);
    };
  }

  disconnect() {
    if (this.api && this.api.readyState < 2) {
      this.api?.close();
    }
    this.emitClose();
  }

  send = (payload: any) => {
    if (this.api) {
      this.api.send(JSON.stringify(payload));
    } else {
      throw new Error('Socket connection not initialized. Dispatch WEBSOCKET_CONNECT first');
    }
  };

  formatOrders(json) {
    if (json?.data?.length && json.table === 'order') {
      return json.data; //.map((order) => order);
    }
  }

  formatInstrument(json) {
    if (json?.data?.length && json.table === 'instrument') {
      return json.data.map(({askPrice, bidPrice}) => ({exchange: this.id, askPrice, bidPrice}));
    }
  }

  formatLiveTrades(json: any) {
    if (json && json.data && json.data.length) {
      if (json.table === 'liquidation' && json.action === 'insert') {
        return json.data.map((trade) => ({
          exchange: this.id,
          timestamp: +new Date(),
          price: trade.price,
          size: trade.leavesQty / (this.quotedInUSD ? trade.price : 1),
          side: trade.side === 'Buy' ? 'buy' : 'sell',
          liquidation: true,
        }));
      } else if (json.table === 'trade' && json.action === 'insert') {
        return json.data.map((trade) => ({
          exchange: this.id,
          timestamp: +new Date(trade.timestamp),
          price: trade.price,
          size: trade.size / (this.quotedInUSD ? trade.price : 1),
          side: trade.side === 'Buy' ? 'buy' : 'sell',
        }));
      }
    }

    return false;
  }

  formatProducts(data) {
    return data.map((a) => a.symbol);
  }

  matchPairName(name) {
    if (this.products.indexOf(name) !== -1) {
      return name;
    } else if ((name = name.replace('BTC', 'XBT')) && this.products.indexOf(name) !== -1) {
      return name;
    }

    return false;
  }
}
