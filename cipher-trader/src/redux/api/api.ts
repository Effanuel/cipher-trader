import {Exchange} from '../middlewares/actions';
import {Api as BitmexAPI} from './bitmex';
import {Api as BinanceAPI} from './binance';
import {ORD_TYPE} from './bitmex/types';

export type MarketOrderProps = {ticker: string; quantity: number; side: string};

export type OrderBulk = any;

export interface StandartizedMethods {
  marketOrder: (args: MarketOrderProps) => Promise<any>;
}

export type APIType = ClassMethods<typeof API>;

export class API implements APIType {
  requestParamsFactory = new RequestParamsFactory();
  exchangeAPIs = {
    bitmex: new BitmexAPI(),
    binance: new BinanceAPI(),
  };

  private availableMethods = {
    bitmex: {
      marketOrder: (props: {symbol: string; orderQty: number; side: string}) =>
        this.exchangeAPIs.bitmex.order.orderNew({...props, ordType: ORD_TYPE.Market}),
    },
    binance: {
      marketOrder: (props: {symbol: string; quantity: number; side: 'SELL' | 'BUY'}) => {
        return this.exchangeAPIs.binance.api.v3OrderCreate({
          ...props,
          timestamp: +new Date(),
          type: 'MARKET',
          signature: '2',
        });
      },
    },
    bybit: {
      marketOrder: (props: {symbol: string; orderQty: number; side: string}) =>
        this.exchangeAPIs.bitmex.order.orderNew({...props, ordType: ORD_TYPE.Market}),
    },
  };

  getQuery(exchange: Exchange) {
    return (method: keyof StandartizedMethods) => {
      return (props: Parameters<StandartizedMethods[keyof StandartizedMethods]>[number]) => {
        switch (exchange) {
          case 'bitmex': {
            const adjustedProps = this.requestParamsFactory.toBitMEX({method, props});
            return this.availableMethods['bitmex'][method](adjustedProps);
          }
          case 'binance': {
            const adjustedProps = this.requestParamsFactory.toBinance({method, props});
            return this.availableMethods['binance'][method](adjustedProps);
          }
        }
      };
    };
  }
}

interface Params {
  method: keyof StandartizedMethods;
  props: Parameters<StandartizedMethods[keyof StandartizedMethods]>[number];
}

class RequestParamsFactory {
  toBitMEX({method, props}: Params) {
    switch (method) {
      case 'marketOrder':
        return {symbol: props.ticker, orderQty: props.quantity, side: props.side};
    }
  }

  toBinance({method, props}: Params) {
    switch (method) {
      case 'marketOrder':
        return {symbol: props.ticker, quantity: props.quantity, side: props.side as 'SELL' | 'BUY'};
    }
  }
}
