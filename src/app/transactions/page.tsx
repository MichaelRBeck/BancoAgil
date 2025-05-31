'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/navbar/navbar';
import Footer from '../components/footer/footer';
import DinamicTransactionTable from '../components/tables/dinamicTransactionTable';
import { useTransactions } from './hooks/useTransactions';
import { UserHeader } from './components/UserHeader';
import TotalBalanceCard from './components/TotalBalanceCard';
import NewTransactionButton from './components/NewTransactionButton';

import { PageWrapper, LayoutContainer, ContentWrapper, ContentInner } from './styles';

export default function TransactionPage() {
  // Estado para armazenar o ID do usuário autenticado (lido do localStorage)
  const [authUserId, setAuthUserId] = useState<string | null>(null);

  // Ao montar o componente, busca o userId no localStorage e salva no estado
  useEffect(() => {
    const storedAuthUserId = localStorage.getItem('authUserId');
    setAuthUserId(storedAuthUserId);
  }, []);

  // Hook customizado que busca dados do usuário e suas transações com base no authUserId
  const { user, transactions, setTransactions } = useTransactions(authUserId);

  // Se ainda não temos o userId, não renderiza nada (aguarda o carregamento)
  if (!authUserId) {
    return null;
  }

  // Filtra as transações por tipo para separar na tabela correta
  const transferTransactions = transactions.filter(tx => tx.type === 'Transferência');
  const depositTransactions = transactions.filter(tx => tx.type === 'Depósito');
  const withdrawTransactions = transactions.filter(tx => tx.type === 'Saque');

  // Função que atualiza uma transação na lista (para edição)
  const handleUpdate = (updatedTx: any) => {
    setTransactions(prev =>
      prev.map(tx => (tx._id === updatedTx._id ? updatedTx : tx))
    );
  };

  return (
    <PageWrapper>
      <LayoutContainer>
        {/* Navbar fixa no topo */}
        <Navbar />

        <ContentWrapper>
          <ContentInner>
            {/* Cabeçalho com dados do usuário */}
            <UserHeader user={user} />

            <div className="p-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                {/* Cartão que mostra o saldo total do usuário */}
                <TotalBalanceCard user={user} />
              </div>
            </div>

            {/* Botão para criar nova transação */}
            <NewTransactionButton />

            {/* Tabela dinâmica para transferências, permite edição */}
            <DinamicTransactionTable
              title="Transferências"
              transactions={transferTransactions}
              onTransactionUpdated={handleUpdate}
              editable={true}
              loggedUserCpf={user?.cpf ?? ''}
            />

            {/* Tabela para depósitos */}
            <DinamicTransactionTable
              title="Depósitos"
              transactions={depositTransactions}
              onTransactionUpdated={handleUpdate}
              editable={true}
            />

            {/* Tabela para saques */}
            <DinamicTransactionTable
              title="Saques"
              transactions={withdrawTransactions}
              onTransactionUpdated={handleUpdate}
              editable={true}
            />
          </ContentInner>
        </ContentWrapper>
      </LayoutContainer>

      {/* Rodapé da página */}
      <Footer />
    </PageWrapper>
  );
}
