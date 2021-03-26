import {API, StandartizedMethods} from '../api/api';
import parseAPIResponse from '../api/parseAPIResponse';
import {AppState, Thunk} from '../store/state';

interface ActionTypes<P extends string> {
  loading: `${P}/loading`;
  success: `${P}/success`;
  error: `${P}/error`;
}

export function createAction<T extends string>(prefix: T) {
  return {
    loading: prefix + '/loading',
    success: prefix + '/success',
    error: prefix + '/error',
  } as ActionTypes<T>;
}

export type ThunkActions<T extends string, A extends (...args: any) => any> =
  | {type: `${T}/loading`}
  | {type: `${T}/success`; payload: ThenArg<ReturnType<ReturnType<A>>>}
  | {type: `${T}/error`; payload: unknown};

export function createThunkAction<
  K extends keyof StandartizedMethods,
  P extends Parameters<StandartizedMethods[K]>[number],
  T extends string
>(type: T, apiMethod: K) {
  const action = createAction(type);

  const actionCreator = (payload: P) => async (dispatch: any, getState: () => AppState, extra: API) => {
    const {activeExchange} = getState().order;
    try {
      dispatch({type: action.loading});

      const {data} = await extra.getQuery(activeExchange)(apiMethod)(payload);
      const parsedData = parseAPIResponse(apiMethod)(data.data);

      dispatch({type: action.success, payload: parsedData});
      return parsedData;
    } catch (err) {
      console.log(err, 'errrrrr');
      dispatch({type: action.error, payload: err});
    }
  };
  return Object.assign(actionCreator, action);
}
