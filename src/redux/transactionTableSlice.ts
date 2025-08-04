// corrigido: transactionTableSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Transaction } from '../app/transactions/types/transaction';

interface TransactionTableState {
  list: Transaction[];
  cpfFilter: string;
  expandedRows: string[];
  columnFilters: any[];
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
  };
  valorMin: string;
  valorMax: string;
  dataInicio: string;
  dataFim: string;
}

const initialState: TransactionTableState = {
  list: [],
  cpfFilter: '',
  expandedRows: [],
  columnFilters: [],
  pagination: { pageIndex: 0, pageSize: 5, totalCount: 0 },
  valorMin: '',
  valorMax: '',
  dataInicio: '',
  dataFim: '',
};

const transactionTableSlice = createSlice({
  name: 'transactionTable',
  initialState,
  reducers: {
    setFiltersFromQuery: (state, action) => {
      const {
        type = '',
        search = '',
        valorMin = '',
        valorMax = '',
        dataInicio = '',
        dataFim = '',
      } = action.payload;

      // Esses filtros afetam apenas o estado local, não os filtros da tabela react-table
      state.valorMin = valorMin;
      state.valorMax = valorMax;
      state.dataInicio = dataInicio;
      state.dataFim = dataFim;

      // Filtros que afetam colunas da tabela
      const filters = [];

      if (type) filters.push({ id: 'type', value: type });
      if (search) filters.push({ id: 'cpfFilter', value: search });

      state.columnFilters = filters;
    },
    setTransactionsList(state, action: PayloadAction<Transaction[]>) {
      state.list = action.payload;
    },
    setCpfFilter(state, action: PayloadAction<string>) {
      state.cpfFilter = action.payload;
    },
    toggleExpandedRow(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.expandedRows.includes(id)) {
        state.expandedRows = state.expandedRows.filter(rowId => rowId !== id);
      } else {
        state.expandedRows.push(id);
      }
    },
    setColumnFilters(state, action: PayloadAction<any[]>) {
      state.columnFilters = action.payload;
    },
    setPagination(state, action: PayloadAction<{ pageIndex: number; pageSize: number; totalCount?: number }>) {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
        totalCount: action.payload.totalCount ?? state.pagination.totalCount,
      };
    },
    setValorMin(state, action: PayloadAction<string>) {
      state.valorMin = action.payload;
    },
    setValorMax(state, action: PayloadAction<string>) {
      state.valorMax = action.payload;
    },
    setDataInicio(state, action: PayloadAction<string>) {
      state.dataInicio = action.payload;
    },
    setDataFim(state, action: PayloadAction<string>) {
      state.dataFim = action.payload;
    },
    removeTransactionById(state, action: PayloadAction<string>) {
      state.list = state.list.filter(tx => tx._id !== action.payload);
    },
  },
});

export const {
  setTransactionsList,
  setCpfFilter,
  toggleExpandedRow,
  setColumnFilters,
  setPagination,
  setValorMin,
  setValorMax,
  setDataInicio,
  setDataFim,
  setFiltersFromQuery,
  removeTransactionById,
} = transactionTableSlice.actions;

export default transactionTableSlice.reducer;
