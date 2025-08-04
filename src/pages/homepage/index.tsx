// pages/homepage/index.tsx

import React, { useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { wrapper } from '@/redux/store';
import { setUser } from '@/redux/userSlice';
import { setTransactions } from '@/redux/transactionsSlice';
import { RootState, AppStore } from '@/redux/store';

import Footer from '@/app/components/footer/footer';
import Navbar from '@/app/components/navbar/navbar';
import TransactionTable from '@/app/components/tables/transactionTable';
import NewTransactionButton from '@/app/components/NewTransactionButton';

import { UserSummary } from '@/app/homepage/components/UserSummary';
import { BalanceOverTimeChart } from '@/app/homepage/components/charts/BalanceOverTimeChart';
import { TransactionTypePieChart } from '@/app/homepage/components/charts/TransactionTypePieChart';
import { DailyComparisonChart } from '@/app/homepage/components/charts/DailyComparisonChart';
import { MonthlyTransactionBarChart } from '@/app/homepage/components/charts/MonthlyTransactionBarChart';
import { TopTransactionsBarChart } from '@/app/homepage/components/charts/TopTransactionsBarChart';

import {
  PageWrapper,
  LayoutContainer,
  MainContent,
  ContentInner,
  ActionSection,
  TransactionsSection,
  AnalyticsSection,
  ChartCard,
  ButtonWrapper,
  SectionCard,
  SectionTitle,
  SectionDivider,
  ResponsiveChartsGrid,
} from '@/app/homepage/styles';

import type { Transaction } from '@/app/transactions/types/transaction';

export const getServerSideProps = wrapper.getServerSideProps(
  (store: AppStore) =>
    async ({ req }: GetServerSidePropsContext) => {
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

      try {
        const userRes = await fetch(`${baseUrl}/api/get-user`, {
          headers: { cookie: `token=${token}` },
        });

        if (!userRes.ok) throw new Error('Usuário não autenticado');

        const user = await userRes.json();
        store.dispatch(setUser(user));

        const transRes = await fetch(`${baseUrl}/api/transaction?userId=${user.id}`);
        const data = await transRes.json();
        const transactions = Array.isArray(data.transactions) ? data.transactions : [];

        store.dispatch(setTransactions(transactions));

        return { props: {} };
      } catch (err) {
        console.error('Erro no getServerSideProps:', err);
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
    }
);

export default function Homepage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const userId = user?.id;

  const transactions = useSelector((state: RootState) =>
    Array.isArray(state.transactions?.list) ? state.transactions.list : []
  );

  useEffect(() => {
    if (!userId) {
      router.replace('/');
    }
  }, [userId, router]);

  if (!userId) return null;

  const handleSave = async (newTransaction: Transaction) => {
    try {
      const res = await fetch(`/api/get-user?id=${userId}`);
      if (!res.ok) throw new Error('Erro ao atualizar saldo.');
      const updatedUser = await res.json();
      // dispatch(setUser(updatedUser)); // opcional

      const txRes = await fetch(`/api/transaction?userId=${userId}`);
      const data = await txRes.json();
      const txList = Array.isArray(data.transactions) ? data.transactions : [];
      dispatch(setTransactions(txList));
    } catch (err) {
      console.error('Erro ao atualizar transações:', err);
    }
  };

  return (
    <PageWrapper>
      <LayoutContainer>
        <Navbar />
        <MainContent>
          <ContentInner>
            <SectionCard>
              <SectionTitle>Resumo</SectionTitle>
              <UserSummary />
            </SectionCard>

            <SectionDivider />

            <SectionCard>
              <SectionTitle>Suas Transações</SectionTitle>
              <ActionSection>
                <ButtonWrapper>
                  <NewTransactionButton userId={userId} onSave={handleSave}>
                    Realizar uma nova transação
                  </NewTransactionButton>
                </ButtonWrapper>
              </ActionSection>
              <TransactionsSection>
                <TransactionTable title="Últimas 5 Transações" limit={5} />
              </TransactionsSection>
            </SectionCard>

            <SectionDivider />

            <SectionCard>
              <SectionTitle>Análises</SectionTitle>
              <AnalyticsSection>
                <ResponsiveChartsGrid>
                  <ChartCard colSpan={6} rowSpan={2} colStart={1} rowStart={1}>
                    <BalanceOverTimeChart transactions={transactions} />
                  </ChartCard>

                  <ChartCard colSpan={6} rowSpan={1} colStart={7} rowStart={1}>
                    <TransactionTypePieChart transactions={transactions} />
                  </ChartCard>

                  <ChartCard colSpan={6} rowSpan={1} colStart={7} rowStart={2}>
                    <MonthlyTransactionBarChart transactions={transactions} />
                  </ChartCard>

                  <ChartCard colSpan={6} rowSpan={1}>
                    <DailyComparisonChart transactions={transactions} />
                  </ChartCard>

                  <ChartCard colSpan={6} rowSpan={1}>
                    <TopTransactionsBarChart transactions={transactions} />
                  </ChartCard>
                </ResponsiveChartsGrid>
              </AnalyticsSection>
            </SectionCard>
          </ContentInner>
        </MainContent>
      </LayoutContainer>
      <Footer />
    </PageWrapper>
  );
}
