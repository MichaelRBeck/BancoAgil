import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '@/app/transactions/types/transaction';

interface ModalState {
  isOpen: boolean;
  transactionToEdit?: Transaction | null;
}

interface ModalState {
  isOpen: boolean;
  transactionToEdit?: Transaction | null;
}

const initialState: ModalState = {
  isOpen: false,
  transactionToEdit: null,
};

const transactionModalSlice = createSlice({
  name: 'transactionModal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ transaction?: Transaction }>) => {
      state.isOpen = true;
      state.transactionToEdit = action.payload.transaction || null;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.transactionToEdit = null;
    },
  },
});

export const { openModal, closeModal } = transactionModalSlice.actions;
export default transactionModalSlice.reducer;

