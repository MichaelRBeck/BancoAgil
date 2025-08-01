import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import userReducer from './userSlice';
import transactionsReducer from './transactionsSlice';
import transactionTableReducer from './transactionTableSlice'; 
import transactionModalReducer from './transactionModalSlice';

const makeStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      transactions: transactionsReducer,
      transactionModal: transactionModalReducer,
      transactionTable: transactionTableReducer,
    },
  });

export const wrapper = createWrapper(makeStore);
export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
