import {Exchange} from '../../middlewares/actions';

export const SET_ACTIVE_EXCHANGE = 'order/SET_ACTIVE_EXCHANGE';
export const SET_ACTIVE_TICKER = 'order/SET_ACTIVE_TICKER';

export const MARKET_ORDER = 'order/MARKET_ORDER';

export interface OrderState {
  activeExchange: Exchange;
  activeTicker: string;
  loading: boolean;
  error: string;
}

export type OrderAction =
  | {type: typeof SET_ACTIVE_EXCHANGE; payload: Exchange}
  | {type: typeof SET_ACTIVE_TICKER; payload: string};
