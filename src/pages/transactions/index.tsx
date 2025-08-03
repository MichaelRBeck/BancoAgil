'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Navbar from '../../app/components/navbar/navbar';
import Footer from '../../app/components/footer/footer';
import DinamicTransactionTable from '../../app/components/tables/dinamicTransactionTable';
import { UserHeader } from '../../app/transactions/components/UserHeader';
import TotalBalanceCard from '../../app/components/TotalBalanceCard';
import NewTransactionButton from '../../app/components/NewTransactionButton';

import {
  PageWrapper,
  LayoutContainer,
  ContentWrapper,
  ContentInner,
} from '../../app/transactions/styles';

import type { Transaction } from '../../app/transactions/types/transaction';
import { RootState, wrapper, AppDispatch } from '../../redux/store';
import { setUser, setUserBalance } from '../../redux/userSlice';
import { setTransactionsList } from '../../redux/transactionTableSlice';

interface TransactionPageProps {
  userId: string;
  transactions: Transaction[];
}

export default function TransactionPage({ userId, transactions: ssrTransactions }: TransactionPageProps) {
  const dispatch = useDispatch<AppDispatch>();

  // Pega as transações do Redux
  const transactions = useSelector((state: RootState) => state.transactionTable.list);
  const totalBalance = useSelector((state: RootState) => state.user.totalBalance);
  const user = useSelector((state: RootState) => state.user);

  const [loading, setLoading] = useState(false);

  // Hidrata o Redux com as transações carregadas no SSR assim que o componente monta
  useEffect(() => {
    if (ssrTransactions.length > 0) {
      dispatch(setTransactionsList(ssrTransactions));
    }
  }, [dispatch, ssrTransactions]);

  // Debug logs para garantir que os dados chegam
  useEffect(() => {
    console.log('Redux transactions:', transactions);
    console.log('User in redux:', user);
  }, [transactions, user]);

  const handleSave = async (newTransaction: Transaction) => {
    setLoading(true);
    try {
      const response = await fetch('/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      });
      if (!response.ok) throw new Error('Erro ao salvar transação');

      const savedTx: Transaction = await response.json();

      dispatch(setTransactionsList([savedTx, ...transactions]));

      let delta = 0;
      switch (savedTx.type) {
        case 'Depósito':
          delta = savedTx.value;
          break;
        case 'Saque':
          delta = -savedTx.value;
          break;
        case 'Transferência':
          delta = -savedTx.value;
          break;
      }
      dispatch(setUserBalance(totalBalance + delta));
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar a transação.');
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionUpdated = async (updatedTx: Transaction) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/transaction/${updatedTx._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTx),
      });
      if (!response.ok) throw new Error('Erro ao atualizar transação');

      const updatedTransaction: Transaction = await response.json();

      const oldTx = transactions.find(t => t._id === updatedTx._id);
      if (!oldTx) throw new Error('Transação antiga não encontrada');

      dispatch(
        setTransactionsList(
          transactions.map(t => (t._id === updatedTx._id ? updatedTransaction : t))
        )
      );

      const diff = updatedTransaction.value - oldTx.value;
      let delta = 0;
      switch (updatedTransaction.type) {
        case 'Depósito':
          delta = diff;
          break;
        case 'Saque':
          delta = -diff;
          break;
        case 'Transferência':
          delta = -diff;
          break;
      }
      dispatch(setUserBalance(totalBalance + delta));
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar a transação.');
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionDeleted = async (deletedId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/transaction/${deletedId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao deletar transação');

      const deletedTx = transactions.find(tx => tx._id === deletedId);
      if (!deletedTx) throw new Error('Transação não encontrada');

      dispatch(setTransactionsList(transactions.filter(tx => tx._id !== deletedId)));

      let delta = 0;
      switch (deletedTx.type) {
        case 'Depósito':
          delta = -deletedTx.value;
          break;
        case 'Saque':
          delta = deletedTx.value;
          break;
        case 'Transferência':
          delta = deletedTx.value;
          break;
      }
      dispatch(setUserBalance(totalBalance + delta));
    } catch (error) {
      console.error(error);
      alert('Erro ao deletar a transação.');
    } finally {
      setLoading(false);
    }
  };

  if (!userId) return <p>Usuário não autenticado. Por favor, faça login.</p>;

  return (
    <PageWrapper>
      <LayoutContainer>
        <Navbar />
        <ContentWrapper>
          <ContentInner>
            <UserHeader />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <TotalBalanceCard />
              <NewTransactionButton userId={userId} onSave={handleSave} disabled={loading}>
                Realizar uma nova transação
              </NewTransactionButton>
            </div>

            <DinamicTransactionTable
              title="Transações"
              transactions={transactions}
              editable={true}
              onTransactionUpdated={handleTransactionUpdated}
              onTransactionDeleted={handleTransactionDeleted}
            />
          </ContentInner>
        </ContentWrapper>
      </LayoutContainer>
      <Footer />
    </PageWrapper>
  );
}

// SSR com next-redux-wrapper para popular estado no server e enviar para o client
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async ({ req }) => {
    const cookie = req.headers.cookie || '';
    const token = cookie
      .split('; ')
      .find((c) => c.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    // Função para buscar usuário autenticado pelo token
    async function fetchUserByToken(token: string) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // fallback local
      const res = await fetch(`${baseUrl}/api/get-user`, {
        headers: { cookie: `token=${token}` },
      });
      if (!res.ok) return null;
      return await res.json();
    }

    // Função para buscar transações do usuário
    async function fetchTransactionsByUserId(userId: string) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction?userId=${userId}`
      );
      if (!res.ok) return [];
      return await res.json();
    }

    const user = await fetchUserByToken(token);
    if (!user) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const transactions = await fetchTransactionsByUserId(user.id);

    store.dispatch(setUser(user));
    store.dispatch(setUserBalance(user.totalBalance ?? 0));
    store.dispatch(setTransactionsList(transactions));

    console.log('SSR - Usuário:', user);
    console.log('SSR - Transações:', transactions);

    return {
      props: {
        userId: user.id,
        transactions,
      },
    };
  }
);
