import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import {WebsocketState} from '../modules/websocket/types';

export type Thunk = ThunkAction<void, AppState, undefined, Action<string>>;

export interface AppState {
  websocket: WebsocketState;
}
