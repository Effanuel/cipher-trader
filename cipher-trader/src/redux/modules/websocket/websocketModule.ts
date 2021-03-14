import {Reducer} from 'redux';
import {authKeyExpires} from '../../middlewares/auth';
import {Thunk} from '../../store/state';
import {WebsocketState} from './types';

export const connect = (): Thunk => async (dispatch) => {
  try {
    dispatch({type: 'connect', payload: {message: 'message socket'}});
  } catch (err) {}
};

export const disconnect = (): Thunk => async (dispatch) => {
  try {
    dispatch({type: 'disconnect', payload: {message: 'message socket'}});
  } catch (err) {}
};

export const authenticate = (): Thunk => async (dispatch) => {
  try {
    dispatch({type: 'send', payload: authKeyExpires('/realtime', 'GET')});
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.response.data, 'wsAuthenticate error');
  }
};

export const wsSubscribeTo = (payload: 'order'): Thunk => async (dispatch) => {
  try {
    dispatch({type: 'send', payload: {op: 'subscribe', args: [payload]}});
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.response.data, 'wsSubscribe Error');
  }
};

const initialState: WebsocketState = {
  isConnected: false,
  tradePrice: null,
  askPrice: null,
  bidPrice: null,
  orders: [],
  error: '',
};

export const websocketReducer: Reducer<WebsocketState, any> = (state = initialState, action: Action) => {
  switch (action.type) {
    case 'connected':
      return {...state, isConnected: true};
    case 'trades':
      return {...state, tradePrice: action.payload};
    case 'orders':
      return {...state, orders: action.payload};
    case 'instrument':
      const {askPrice, bidPrice} = action.payload[0];
      return {...state, askPrice, bidPrice};
    default:
      return state;
  }
};
