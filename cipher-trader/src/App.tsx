import React from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {connect, disconnect, setActiveExchange, wsSubscribeTo} from './redux/modules/websocket/websocketModule';
import './App.css';
import {AppState} from './redux/store/state';

function App() {
  const dispatch = useDispatch();

  const {tradePrice, askPrice, bidPrice, isConnected, orders} = useSelector(
    (state: AppState) => ({
      tradePrice: state.websocket.tradePrice,
      askPrice: state.websocket.askPrice,
      bidPrice: state.websocket.bidPrice,
      isConnected: state.websocket.isConnected,
      orders: state.websocket.orders,
    }),
    shallowEqual,
  );

  React.useEffect(() => {
    dispatch(connect());
    return () => {
      dispatch(disconnect());
    };
  }, [dispatch]);

  const close = () => {
    dispatch(disconnect());
  };

  const setActive = (exchange: any) => {
    dispatch(setActiveExchange(exchange));
  };

  React.useEffect(() => {
    if (isConnected) {
      console.log('AYTTTTTTTTTTTTTTTTTTTTTTTTT');
      // dispatch(authenticate());
      // dispatch(wsSubscribeTo('instrument_info.100ms.BTCUSDT'));
    }
  }, [dispatch, isConnected]);

  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', background: 'white', fontSize: 25, color: '#1e1e1e'}}>{askPrice}</div>
      <div style={{display: 'flex', background: 'white', fontSize: 30, color: '#121212'}}>{tradePrice}</div>
      <div style={{display: 'flex', background: 'white', fontSize: 25, color: '#1e1e1e'}}>{bidPrice}</div>
      <button onClick={close}>disconnect</button>
      <button onClick={() => setActive('binance')}>CONNECT TO BINANACE</button>
      <button onClick={() => setActive('bitmex')}>CONNECT TO BITMEX</button>
      {/* <button onClick={setActive}>CONNECT TO BYBIT</button> */}
      <ul>
        {orders.length &&
          orders.map((order) => {
            return <li key={order.orderID}>{JSON.stringify(order).slice(20)}</li>;
          })}
      </ul>
    </div>
  );
}

export default App;
