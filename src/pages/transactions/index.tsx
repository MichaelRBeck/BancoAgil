'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

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
  ButtonWrapper
} from '../../app/transactions/styles';

import type { Transaction } from '../../app/transactions/types/transaction';
import { RootState, wrapper, AppDispatch } from '../../redux/store';
import { setUser, setUserBalance } from '../../redux/userSlice';
import { setTransactionsList, setPagination, setFiltersFromQuery } from '../../redux/transactionTableSlice';

interface TransactionPageProps {
  userId: string;
  transactions: Transaction[];
  totalCount: number;
  initialPagination: {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
  };
}

export default function TransactionPage({
  userId,
  transactions: ssrTransactions,
  totalCount,
  initialPagination,
}: TransactionPageProps) {
  const dispatch = useDispatch<AppDispatch>();

  const transactions = useSelector((state: RootState) => state.transactionTable.list);
  const totalBalance = useSelector((state: RootState) => state.user.totalBalance);
  const user = useSelector((state: RootState) => state.user);
  const pagination = useSelector((state: RootState) => state.transactionTable.pagination);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isReduxHydrated = transactions.length > 0;
    if (!isReduxHydrated) {
      dispatch(setTransactionsList(ssrTransactions));
      dispatch(setPagination(initialPagination));
    }
  }, [dispatch, transactions.length, ssrTransactions, initialPagination]);

  const router = useRouter();

  useEffect(() => {
    const {
      type = '',
      search = '',
      valorMin = '',
      valorMax = '',
      dataInicio = '',
      dataFim = '',
    } = router.query;

    dispatch(setFiltersFromQuery({
      type,
      search,
      valorMin,
      valorMax,
      dataInicio,
      dataFim,
    }));
  }, [router.query]);


  const handleSave = async (newTransaction: Transaction) => {
    setLoading(true);
    try {
      const txRes = await fetch(
        `/api/transaction?userId=${userId}&page=${pagination.pageIndex + 1}&pageSize=${pagination.pageSize}`
      );
      const { transactions: updatedTransactions, totalCount } = await txRes.json();

      dispatch(setTransactionsList(updatedTransactions));
      dispatch(setPagination({ ...pagination, totalCount }));

      const userRes = await fetch(`/api/get-user?id=${userId}`);
      if (userRes.ok) {
        const updatedUser = await userRes.json();
        dispatch(setUserBalance(updatedUser.totalBalance ?? 0));
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar lista de transações.');
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

      const txRes = await fetch(
        `/api/transaction?userId=${userId}&page=${pagination.pageIndex + 1}&pageSize=${pagination.pageSize}`
      );
      const { transactions: updatedTransactions, totalCount } = await txRes.json();

      dispatch(setTransactionsList(updatedTransactions));
      dispatch(setPagination({ ...pagination, totalCount }));

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
      const txRes = await fetch(
        `/api/transaction?userId=${userId}&page=${pagination.pageIndex + 1}&pageSize=${pagination.pageSize}`
      );
      const { transactions: updatedTransactions, totalCount } = await txRes.json();

      dispatch(setTransactionsList(updatedTransactions));
      dispatch(setPagination({ ...pagination, totalCount }));

      const userRes = await fetch(`/api/get-user?id=${userId}`);
      if (userRes.ok) {
        const updatedUser = await userRes.json();
        dispatch(setUserBalance(updatedUser.totalBalance ?? 0));
      }
    } catch (error: any) {
      console.error('❌ Erro ao atualizar lista após exclusão:', error.message);
      alert(error.message || 'Erro ao atualizar lista após exclusão.');
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
              <ButtonWrapper>
                <NewTransactionButton userId={userId} onSave={handleSave} disabled={loading}>
                  Realizar uma nova transação
                </NewTransactionButton>
              </ButtonWrapper>
            </div>
            <DinamicTransactionTable
              title="Transações"
              transactions={transactions.length > 0 ? transactions : ssrTransactions || []}
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
  (store) => async ({ req, query }) => {
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

    // PAGINAÇÃO
    const page = parseInt(query.page as string) || 1;
    const pageSize = parseInt(query.pageSize as string) || 5;

    // FILTROS
    const type = query.type as string || '';
    const search = query.search as string || '';
    const valorMin = query.valorMin as string || '';
    const valorMax = query.valorMax as string || '';
    const dataInicio = query.dataInicio as string || '';
    const dataFim = query.dataFim as string || '';

    // FETCH USUÁRIO
    const userRes = await fetch(`${baseUrl}/api/get-user`, {
      headers: { cookie: `token=${token}` },
    });
    if (!userRes.ok) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const user = await userRes.json();

    // CONSTRUIR URL COM FILTROS
    const url = new URL(`${baseUrl}/api/transaction`);
    url.searchParams.set('userId', user.id);
    url.searchParams.set('page', String(page));
    url.searchParams.set('pageSize', String(pageSize));
    if (type) url.searchParams.set('type', type);
    if (search) url.searchParams.set('search', search);
    if (valorMin) url.searchParams.set('valorMin', valorMin);
    if (valorMax) url.searchParams.set('valorMax', valorMax);
    if (dataInicio) url.searchParams.set('dataInicio', dataInicio);
    if (dataFim) url.searchParams.set('dataFim', dataFim);

    // FETCH TRANSACTIONS
    const txRes = await fetch(url.toString());
    const { transactions, totalCount } = txRes.ok ? await txRes.json() : { transactions: [], totalCount: 0 };

    store.dispatch(setUser(user));
    store.dispatch(setUserBalance(user.totalBalance ?? 0));
    store.dispatch(setTransactionsList(transactions));
    store.dispatch(setPagination({ pageIndex: page - 1, pageSize, totalCount }));

    return {
      props: {
        userId: user.id,
        transactions,
        totalCount,
        initialPagination: {
          pageIndex: page - 1,
          pageSize,
          totalCount,
        },
      },
    };
  }
);




