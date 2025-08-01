'use client';
import { atom } from 'recoil';

export const userState = atom({
  key: 'userState',
  default: {
    id: '',
    cpf: '',
    isAuthenticated: false,
  },
});
