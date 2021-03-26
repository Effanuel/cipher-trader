import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Exchange} from '../redux/middlewares/actions';
import {setActiveExchange, setActiveTicker} from '../redux/modules/order/orderModule';
import {AppState} from '../redux/store/state';
import {SelectDropdown} from './SelectDropdown';

const options = ['XBTUSD', 'ETHUSD', 'XRPUSD'];

const exchanges: Exchange[] = ['bitmex', 'binance'];

export function Header() {
  const dispatch = useDispatch();

  const activeTicker = useSelector(({order}: AppState) => order.activeTicker);
  const activeExchange = useSelector(({order}: AppState) => order.activeExchange);

  const updateActiveSymbol = React.useCallback((symbol: string) => dispatch(setActiveTicker(symbol)), [dispatch]);
  const updateActiveExchange = React.useCallback(
    (event) => {
      dispatch(setActiveExchange(event.target.id));
    },
    [dispatch],
  );

  return (
    <header className="shadow">
      <div className="flex justify-center bg-gray-900">
        <div className="flex flex-1 py-2 w-auto px-4 max-w-2xl">
          <h1 className="text-2xl font-bold text-white">Exchanges</h1>
          {exchanges.map((exchange) => (
            <div key={exchange} className="ml-7 flex">
              <span
                id={exchange}
                onClick={updateActiveExchange}
                className={`text-white cursor-pointer px-3 py-2 rounded-md text-sm font-semibold uppercase ${
                  activeExchange === exchange ? 'bg-accent-1 hover:bg-accent-2' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {exchange}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center bg-gray-900">
        <div className="flex flex-1 py-2 w-auto px-4 max-w-2xl">
          <SelectDropdown selectedOption={activeTicker} options={options} onChange={updateActiveSymbol} />
        </div>
      </div>
    </header>
  );
}
