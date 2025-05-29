'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { User, Transaction } from '../types/transaction';

export function useTransactions() {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');

  useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
        const res = await fetch(`/api/get-user?id=${userId}`);
        if (!res.ok) {
          console.error('Erro ao buscar usuário');
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Erro na requisição do usuário:', error);
      }
    })();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
        const res = await fetch(`/api/transaction?userId=${userId}`);
        if (!res.ok) {
          console.error('Erro ao buscar transações');
          return;
        }
        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error('Erro na requisição das transações:', error);
      }
    })();
  }, [userId]);

  return { user, transactions, setTransactions, userId };
}
