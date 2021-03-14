//@ts-nocheck
import Exchange from './exchange';

export class Bitmex extends Exchange {
  private baseUrl = `${this.testnet ? 'testnet' : 'www'}.bitmex.com`;

  constructor(options = {}, private testnet = true) {
    super({id: 'bitmex'});

    this.endoints = {
      PRODUCTS: `https://${this.baseUrl}/api/v1/instrument/active`,
    };

    this.options = {
      url: `wss://${this.baseUrl}/realtime?subscribe=trade:XBTUSD,instrument:XBTUSD`,
      ...this.options,
    };
  }

  connect() {
    const validation = super.connect();
    if (!validation) return Promise.reject();
    else if (validation instanceof Promise) return validation;

    return new Promise((resolve, reject) => {
      this.api = new WebSocket(this.options.url);

      // this.quotedInUSD = /USD$/.test(this.pair) || /^XBT/.test(this.pair);

      this.api.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('on message', data);

        switch (data?.table) {
          case 'trade':
            return this.queueTrades(this.formatLiveTrades(data));
          case 'instrument':
            return this.queueInstrument(this.formatInstrument(data));
          case 'order':
            return this.queueOrders(this.formatOrders(data));
        }
      };
      this.api.onopen = (e) => {
        console.log('ON OPEN');
        this.emitOpen(e);

        resolve();
      };
      this.api.onclose = this.emitClose.bind(this);
      this.api.onerror = (error) => {
        console.log('WEBSCOKET ERRRO: ', error);
        this.emitError({message: `${this.id} disconnected`});

        reject();
      };
    });
  }

  disconnect() {
    if (!super.disconnect()) return;

    if (this.api && this.api.readyState < 2) {
      this.api.close();
    }
  }

  send = (payload) => {
    if (this.api) {
      this.api.send(JSON.stringify(payload));
    } else {
      throw new Error('Socket connection not initialized. Dispatch WEBSOCKET_CONNECT first');
    }
  };

  /*queueTrades(trades) {
      if (!trades.length) {
        return
      }
  
      return this.emit('trades', trades)
    }*/

  formatOrders(json) {
    console.log('FORMAT ORDERS', json);
    if (json?.data?.length && json.table === 'order') {
      return json.data; //.map((order) => order);
    }
  }

  formatInstrument(json) {
    if (json?.data?.length && json.table === 'instrument') {
      return json.data.map(({askPrice, bidPrice}) => ({exchange: this.id, askPrice, bidPrice}));
    }
  }

  formatLiveTrades(json) {
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
