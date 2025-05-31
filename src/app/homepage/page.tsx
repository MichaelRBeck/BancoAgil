'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import Footer from '../components/footer/footer';
import Navbar from '../components/navbar/navbar';
import NewTransactionModal from '../components/modals/newTransactionModal';
import DinamicTransactionTable from '../components/tables/dinamicTransactionTable';

import { UserHeader } from './components/UserHeader';
import { BalanceCard } from './components/BalanceCard';

import { useUser } from './hooks/useUser';
import { useUserTransactions } from './hooks/useUserTransactions';

import { Transaction } from '@/app/transactions/types/transaction';

import {
  PageWrapper,
  LayoutContainer,
  MainContent,
  ContentInner,
  ButtonWrapper,
  NewTransactionButton,
  BalanceContainer,
} from './styles';

export default function Homepage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);

  // Carrega o userId da URL e verifica autenticação via localStorage
  useEffect(() => {
    setIsClient(true);

    const authUserId = localStorage.getItem('authUserId');
    const urlUserId = searchParams.get('id');

    setUserId(urlUserId);

    if (!authUserId || authUserId !== urlUserId) {
      alert('Acesso negado: usuário inválido.');
      router.push('/'); // Redireciona para a home se não autorizado
    }
  }, [router, searchParams]);

  // Busca dados do usuário e suas transações via hooks customizados
  const user = useUser(userId);
  const { transactions, setTransactions } = useUserTransactions(userId);

  // Aguarda o carregamento do client e o userId estar definido
  if (!isClient || !userId) {
    return null;
  }

  return (
    <>
      <PageWrapper>
        <LayoutContainer>
          <Navbar />

          <MainContent>
            <ContentInner>
              {/* Cabeçalho com nome do usuário */}
              <UserHeader fullName={user?.fullName} />

              {/* Cartão com o saldo total */}
              <BalanceContainer>
                <BalanceCard totalBalance={user?.totalBalance} />
              </BalanceContainer>

              {/* Botão para abrir modal de nova transação */}
              <ButtonWrapper>
                <NewTransactionButton onClick={() => setShowNewTransactionModal(true)}>
                  Realizar uma nova transação
                </NewTransactionButton>
              </ButtonWrapper>

              {/* Tabela dinâmica com todas as transações */}
              <DinamicTransactionTable
                title="Todas as Transações"
                transactions={transactions}
                onTransactionUpdated={(updatedTx) =>
                  setTransactions((prev) =>
                    prev.map((tx) => (tx._id === updatedTx._id ? (updatedTx as Transaction) : tx))
                  )
                }
              />
            </ContentInner>
          </MainContent>
        </LayoutContainer>
        <Footer />
      </PageWrapper>

      {/* Modal para criar nova transação */}
      {showNewTransactionModal && (
        <NewTransactionModal onClose={() => setShowNewTransactionModal(false)} userId={userId} />
      )}
    </>
  );
}
