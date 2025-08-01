import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import type { AnyAction } from 'redux';
import type { Transaction } from '@/app/transactions/types/transaction';

interface TransactionsState {
  list: Transaction[];
}

const initialState: TransactionsState = {
  list: [],
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions(state, action: PayloadAction<Transaction[]>) {
      state.list = action.payload;
    },
    clearTransactions(state) {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      if (action.payload.transactions && action.payload.transactions.list) {
        return {
          ...state,
          ...action.payload.transactions,
        };
      }
      return state;
    });
  },
});

export const { setTransactions, clearTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;
