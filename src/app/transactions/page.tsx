'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from '../components/navbar/navbar';
import Footer from '../components/footer/footer';
import DinamicTransactionTable from '../components/tables/dinamicTransactionTable';
import { useTransactions } from './hooks/useTransactions';
import { UserHeader } from './components/UserHeader';
import TotalBalanceCard from './components/TotalBalanceCard';
import NewTransactionButton from './components/NewTransactionButton';

const PageWrapper = styled.div`
  position: relative;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background: white;
  overflow-x: hidden;
`;

const LayoutContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  height: 100%;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  padding: 1.25rem 1.5rem;

  @media (min-width: 640px) {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
`;

const ContentInner = styled.div`
  width: 100%;
  max-width: 80rem;
`;

export default function TransactionPage() {
  const { user, transactions, setTransactions } = useTransactions();

  // Aqui usa o CPF direto do user (assumindo que existe)
  const loggedUserCpf = user?.cpf ?? '';

  const transferTransactions = transactions.filter(tx => tx.type === 'Transferência');
  const depositTransactions = transactions.filter(tx => tx.type === 'Depósito');
  const withdrawTransactions = transactions.filter(tx => tx.type === 'Saque');

  const handleUpdate = (updatedTx: any) => {
    setTransactions(prev =>
      prev.map(tx => (tx._id === updatedTx._id ? updatedTx : tx))
    );
  };

  return (
    <PageWrapper>
      <LayoutContainer>
        <Navbar />

        <ContentWrapper>
          <ContentInner>
            <UserHeader user={user} />
            <div className="p-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                <TotalBalanceCard user={user} />
              </div>
            </div>

            <NewTransactionButton />

            <DinamicTransactionTable
              title="Transferências"
              transactions={transferTransactions}
              onTransactionUpdated={handleUpdate}
              editable={true}
              loggedUserCpf={loggedUserCpf}
            />

            <DinamicTransactionTable
              title="Depósitos"
              transactions={depositTransactions}
              onTransactionUpdated={handleUpdate}
              editable={true}
            />

            <DinamicTransactionTable
              title="Saques"
              transactions={withdrawTransactions}
              onTransactionUpdated={handleUpdate}
              editable={true}
            />
          </ContentInner>
        </ContentWrapper>
      </LayoutContainer>
      <Footer />
    </PageWrapper>
  );
}
