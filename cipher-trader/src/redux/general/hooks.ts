// import {useEffect} from 'react';
// import {useSelector, useDispatch} from 'react-redux';
// import {internetOnline, internetOffline} from '../actions';

// const useInternet = () => {
//   const dispatchAction = useDispatch();
//   const isOnline = useSelector((state) => state.app.internet.isOnline);

//   // Registers event listeners to dispatch online/offline statuses to redux
//   useEffect(() => {
//     const handleOnline = () => {
//       dispatchAction(internetOnline());
//     };

//     const handleOffline = () => {
//       dispatchAction(internetOffline());
//     };

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     return function cleanup() {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, [dispatchAction]);

//   // Invokes the redux dispatchers when there is a change in the online status of the browser
//   useEffect(() => {
//     if (window.navigator.onLine && !isOnline) {
//       dispatchAction(internetOnline());
//     } else if (!window.navigator.onLine && isOnline) {
//       dispatchAction(internetOffline());
//     }
//   }, [dispatchAction, isOnline]);

//   return {
//     isOnline,
//   };
// };
export default {};
