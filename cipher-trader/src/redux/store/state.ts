import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import {WebsocketState} from '../modules/websocket/types';
import {OrderState} from '../modules/order/types';
import {API} from '../api/api';

export type Thunk<R = void, Actions extends Action<any> = Action<string>> = ThunkAction<R, AppState, API, Actions>;

export interface AppState {
  websocket: WebsocketState;
  order: OrderState;
}
