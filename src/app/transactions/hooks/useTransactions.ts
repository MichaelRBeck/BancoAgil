'use client';

import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setTransactionsList } from '../../../redux/transactionTableSlice';
import type { User, Transaction } from '../types/transaction';

export type TransactionType = 'Saque' | 'Depósito' | 'Transferência';

interface Filters {
  search?: string;
  type?: TransactionType;
  page?: number;
  pageSize?: number;
}

export function useTransactions(
  passedUserId?: string | null,
  filters: Filters = {}
) {
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    if (!passedUserId) {
      dispatch(setTransactionsList([]));
      return;
    }

    try {
      // Buscar usuário (se precisar)
      // Opcional, se quiser guardar no hook local ou em outro lugar

      // Buscar transações
      const queryParams = new URLSearchParams();
      queryParams.append('userId', passedUserId);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.page !== undefined) queryParams.append('page', filters.page.toString());
      if (filters.pageSize !== undefined) queryParams.append('pageSize', filters.pageSize.toString());

      const txRes = await fetch(`/api/transaction?${queryParams.toString()}`);
      if (!txRes.ok) throw new Error('Erro ao buscar transações');
      const transactionsData: Transaction[] = await txRes.json();

      dispatch(setTransactionsList(transactionsData));
    } catch (error) {
      console.error(error);
      dispatch(setTransactionsList([]));
    }
  }, [dispatch, passedUserId, filters.search, filters.type, filters.page, filters.pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Retorna só funções relevantes, dados ficam no Redux
  return {
    reload: fetchData,
  };
}
