'use client';

import styled from 'styled-components';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Footer from "../components/footer/footer";
import Navbar from "../components/navbar/navbar";
import NewTransactionModal from "../components/modals/newTransactionModal";
import DinamicTransactionTable from "../components/tables/dinamicTransactionTable";
import { UserHeader } from "./components/UserHeader";
import { BalanceCard } from "./components/BalanceCard";
import { useUser } from "./hooks/useUser";
import { useUserTransactions } from "./hooks/useUserTransactions";
import { Transaction } from "@/app/transactions/types/transaction";

const PageWrapper = styled.div`
  position: relative;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background-color: white;
  overflow-x: hidden;
`;

const LayoutContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  height: 100%;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 1.25rem 2.5rem; /* 20px 40px */

  @media (min-width: 640px) {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
`;

const ContentInner = styled.div`
  width: 100%;
  max-width: 80rem; /* max-w-5xl */
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
`;

const NewTransactionButton = styled.button`
  cursor: pointer;
  height: 2.5rem;
  min-width: 180px;
  border-radius: 12px;
  padding: 0 1.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.015em;
  transition: background-color 0.3s ease;
  color: #FAFAFA;
  background-color: var(--primary);
  border: none;

  &:hover {
    background-color: var(--secondary);
  }
`;

const BalanceContainer = styled.div`
  padding: 1rem;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
`;

export default function Homepage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');

  const user = useUser(userId);
  const { transactions, setTransactions } = useUserTransactions(userId);
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);

  useEffect(() => {
    const authUserId = localStorage.getItem('authUserId');
    const urlUserId = searchParams.get('id');

    if (!authUserId || authUserId !== urlUserId) {
      alert('Acesso negado: usuário inválido.');
      router.push('/');
    }
  }, [router, searchParams]);

  return (
    <>
      <PageWrapper>
        <LayoutContainer>
          <Navbar />

          <MainContent>
            <ContentInner>
              <UserHeader fullName={user?.fullName} />

              <BalanceContainer>
                <BalanceCard totalBalance={user?.totalBalance} />
              </BalanceContainer>

              <ButtonWrapper>
                <NewTransactionButton onClick={() => setShowNewTransactionModal(true)}>
                  Realizar uma nova transação
                </NewTransactionButton>
              </ButtonWrapper>

              <DinamicTransactionTable
                title="Todas as Transações"
                transactions={transactions}
                onTransactionUpdated={(updatedTx) =>
                  setTransactions((prev) =>
                    prev.map((tx) =>
                      tx._id === updatedTx._id ? (updatedTx as Transaction) : tx
                    )
                  )
                }
              />
            </ContentInner>
          </MainContent>
        </LayoutContainer>
        <Footer />
      </PageWrapper>

      {showNewTransactionModal && (
        <NewTransactionModal
          onClose={() => setShowNewTransactionModal(false)}
          userId={userId}
        />
      )}
    </>
  );
}
