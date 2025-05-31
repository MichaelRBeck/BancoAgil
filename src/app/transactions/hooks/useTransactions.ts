'use client';

import { useEffect, useState } from 'react';
import { User, Transaction } from '../types/transaction';

export function useTransactions(passedUserId?: string | null) {
  // Estado para armazenar dados do usuário autenticado
  const [user, setUser] = useState<User | null>(null);
  // Estado para armazenar as transações do usuário
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // Estado para o ID do usuário, inicializado com o valor passado (ou null)
  const [userId, setUserId] = useState<string | null>(passedUserId ?? null);

  // Sempre que o ID passado mudar, atualizamos o estado local userId
  useEffect(() => {
    setUserId(passedUserId ?? null);
  }, [passedUserId]);

  // Quando o userId muda, buscamos os dados do usuário da API
  useEffect(() => {
    if (!userId) {
      // Se não há ID, limpa os dados de usuário e transações
      setUser(null);
      setTransactions([]);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/api/get-user?id=${userId}`);

        if (!res.ok) {
          console.error('Erro ao buscar usuário');
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data); // Atualiza o estado com os dados do usuário
      } catch (error) {
        console.error('Erro na requisição do usuário:', error);
        setUser(null);
      }
    })();
  }, [userId]);

  // Quando o userId muda, buscamos as transações do usuário da API
  useEffect(() => {
    if (!userId) {
      setTransactions([]); // Limpa transações se não houver userId
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/api/transaction?userId=${userId}`);

        if (!res.ok) {
          console.error('Erro ao buscar transações');
          setTransactions([]);
          return;
        }

        const data = await res.json();
        setTransactions(data); // Atualiza o estado com as transações
      } catch (error) {
        console.error('Erro na requisição das transações:', error);
        setTransactions([]);
      }
    })();
  }, [userId]);

  // Retorna os dados para o componente que usar este hook
  return { user, transactions, setTransactions, userId };
}
