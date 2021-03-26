import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import {AppState} from './state';
import {API} from '../api/api';

import {websocketReducer as websocket} from '../modules/websocket/websocketModule';
import {orderReducer as order} from '../modules/order/orderModule';
import {initializeWebsocketMiddleware} from '../middlewares/websocketMiddleware';

const composeEnhancers = (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const initialState = {};

const websocketMiddleware = initializeWebsocketMiddleware();
const middlewares = [thunk.withExtraArgument(new API()), websocketMiddleware];

const rootReducer = combineReducers<AppState>({
  websocket,
  order,
});

export const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middlewares)));
