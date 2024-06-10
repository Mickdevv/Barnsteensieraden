import { configureStore } from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

const initialState = {}

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState,
    enhancers: (getDefaultEnhancers) =>
      getDefaultEnhancers({
        autoBatch: false,
      }).concat(batchedSubscribe(debounceNotify)),
  })
export default store