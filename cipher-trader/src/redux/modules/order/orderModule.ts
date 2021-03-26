import {Reducer} from 'redux';
import {createThunkAction, ThunkActions} from '../../helpers';
import {Exchange} from '../../middlewares/actions';
import {MARKET_ORDER, OrderAction, OrderState, SET_ACTIVE_EXCHANGE, SET_ACTIVE_TICKER} from './types';

export const marketOrder = createThunkAction(MARKET_ORDER, 'marketOrder');

type MarketOrderActions = ThunkActions<typeof MARKET_ORDER, typeof marketOrder>;

export const setActiveExchange = (exchange: Exchange): OrderAction => ({
  type: SET_ACTIVE_EXCHANGE,
  payload: exchange,
});

export const setActiveTicker = (symbol: string): OrderAction => ({
  type: SET_ACTIVE_TICKER,
  payload: symbol,
});

const initialState: OrderState = {
  activeExchange: 'bitmex',
  activeTicker: '',
  loading: false,
  error: '',
};

export const orderReducer: Reducer<OrderState, OrderAction | MarketOrderActions> = (state = initialState, action) => {
  switch (action.type) {
    case marketOrder.loading:
      return {...state, loading: true};
    case marketOrder.success:
      return {...state, loading: false};
    case SET_ACTIVE_EXCHANGE:
      return {...state, activeExchange: action.payload};
    case SET_ACTIVE_TICKER:
      return {...state, activeTicker: action.payload};
    default:
      return state;
  }
};
