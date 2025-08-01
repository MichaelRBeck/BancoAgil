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
  };
  valorMin: string;
  valorMax: string;
  dataInicio: string;
  dataFim: string;
  modalOpen: boolean;
  transactionToEdit: Transaction | null;
}

const initialState: TransactionTableState = {
  list: [], // adiciona aqui
  cpfFilter: '',
  expandedRows: [],
  columnFilters: [],
  pagination: { pageIndex: 0, pageSize: 10 },
  valorMin: '',
  valorMax: '',
  dataInicio: '',
  dataFim: '',
  modalOpen: false,
  transactionToEdit: null,
};

const transactionTableSlice = createSlice({
  name: 'transactionTable',
  initialState,
  reducers: {
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
    setPagination(state, action: PayloadAction<{ pageIndex: number; pageSize: number }>) {
      state.pagination = action.payload;
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
    openModal(state) {
      state.modalOpen = true;
    },
    closeModal(state) {
      state.modalOpen = false;
      state.transactionToEdit = null;
    },
    setTransactionToEdit(state, action: PayloadAction<Transaction | null>) {
      state.transactionToEdit = action.payload;
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
  openModal,
  closeModal,
  setTransactionToEdit,
} = transactionTableSlice.actions;

export default transactionTableSlice.reducer;
