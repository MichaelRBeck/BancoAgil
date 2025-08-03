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

  const transactions = useSelector((state: RootState) => state.transactionTable.list);
  const totalBalance = useSelector((state: RootState) => state.user.totalBalance);
  const user = useSelector((state: RootState) => state.user);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ssrTransactions.length > 0) {
      dispatch(setTransactionsList(ssrTransactions));
    }
  }, [dispatch, ssrTransactions]);

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

      const txRes = await fetch(`/api/transaction?userId=${userId}`);
      const updatedTransactions: Transaction[] = await txRes.json();
      dispatch(setTransactionsList(updatedTransactions));

      const userRes = await fetch(`/api/get-user?id=${userId}`);
      if (userRes.ok) {
        const updatedUser = await userRes.json();
        dispatch(setUserBalance(updatedUser.totalBalance ?? 0));
      }
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

      const txRes = await fetch(`/api/transaction?userId=${userId}`);
      const updatedTransactions: Transaction[] = await txRes.json();
      dispatch(setTransactionsList(updatedTransactions));

      const userRes = await fetch(`/api/get-user?id=${userId}`);
      if (userRes.ok) {
        const updatedUser = await userRes.json();
        dispatch(setUserBalance(updatedUser.totalBalance ?? 0));
      }
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
      if (!response.ok) throw new Error('Erro ao deletar a transação');

      const txRes = await fetch(`/api/transaction?userId=${userId}`);
      const updatedTransactions: Transaction[] = await txRes.json();
      dispatch(setTransactionsList(updatedTransactions));

      const userRes = await fetch(`/api/get-user?id=${userId}`);
      if (userRes.ok) {
        const updatedUser = await userRes.json();
        dispatch(setUserBalance(updatedUser.totalBalance ?? 0));
      }
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

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    async function fetchUserByToken() {
      const res = await fetch(`${baseUrl}/api/get-user`, {
        headers: { cookie: `token=${token}` },
      });
      if (!res.ok) return null;
      return await res.json();
    }

    async function fetchTransactionsByUserId(userId: string) {
      const res = await fetch(`${baseUrl}/api/transaction?userId=${userId}`);
      if (!res.ok) return [];
      return await res.json();
    }

    const user = await fetchUserByToken();
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

    return {
      props: {
        userId: user.id,
        transactions,
      },
    };
  }
);
