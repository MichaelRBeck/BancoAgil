import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import type { AnyAction } from 'redux';

interface UserState {
  id: string | null;
  fullName?: string;
  cpf?: string;
  totalBalance: number;
}

const initialState: UserState = {
  id: null,
  fullName: undefined,
  cpf: undefined,
  totalBalance: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      return action.payload;
    },
    clearUser() {
      return initialState;
    },
    setUserId(state, action: PayloadAction<string | null>) {
      state.id = action.payload;
    },
    setUserBalance(state, action: PayloadAction<number>) {
      state.totalBalance = action.payload;
    },
    logout() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      if (action.payload.user) {
        return {
          ...state,
          ...action.payload.user,
        };
      }
      return state;
    });
  },
});

export const { setUser, clearUser, setUserId, setUserBalance, logout } = userSlice.actions;
export default userSlice.reducer;
