import React from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {connect, disconnect, setActiveExchange} from './redux/middlewares/actions';
import {AppState} from './redux/store/state';
import './App.css';
import {Button, Header, Input, SelectDropdown} from './components';
import {marketOrder} from './redux/modules/order/orderModule';

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

  // React.useEffect(() => {
  //   dispatch(connect('binance'));
  //   return () => {
  //     dispatch(disconnect());
  //   };
  // }, [dispatch]);

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
    <div className="bg-gray-700">
      <Header />
      <div className="px-4">
        <Button
          onClick={() => dispatch(marketOrder({quantity: 111, side: 'Buy', ticker: 'XBTUSD'}))}
          label="Market Buy"
          type="buy"
        />
        <Button onClick={() => {}} label="Market Sell" type="sell" />
        <Input id="quantity" label="Quantity" value="" onChange={() => {}} />
      </div>
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
    </div>
  );
}

export default App;
