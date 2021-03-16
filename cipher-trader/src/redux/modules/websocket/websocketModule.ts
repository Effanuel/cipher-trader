import {Reducer} from 'redux';
import {$CLOSE, $CONNECT, $DISCONNECT, $ERROR, $INSTRUMENT_DATA, $OPEN, $ORDERS_DATA} from '../../middlewares/actions';
import {authKeyExpires} from '../../middlewares/auth';
import {Thunk} from '../../store/state';
import {WebsocketState} from './types';

export const authenticate = (): Thunk => async (dispatch) => {
  try {
    dispatch({type: 'send', payload: authKeyExpires('/realtime', 'GET')});
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.response.data, 'wsAuthenticate error');
  }
};

export const wsSubscribeTo = (payload: string): Thunk => async (dispatch) => {
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
  status: '',
};

export const websocketReducer: Reducer<WebsocketState, any> = (state = initialState, action: Action) => {
  switch (action.type) {
    case $CONNECT:
      return {...state, status: 'Connecting...'};
    case $OPEN:
      return {...state, status: 'Connected'};
    case $DISCONNECT:
      return {...state, status: 'Disconnecting...'};
    case $CLOSE:
      return {...state, status: 'Disconnected.'};
    case 'trades':
      return {...state, tradePrice: action.payload};
    case $ORDERS_DATA:
      return {...state, orders: action.payload};
    case $INSTRUMENT_DATA:
      const {askPrice, bidPrice} = action.payload[0];
      return {...state, askPrice, bidPrice};
    case $ERROR:
      return state;
    default:
      return state;
  }
};
