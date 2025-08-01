'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

import {
  HeaderSection,
  UserInfo,
  Avatar,
  UserName,
  BalanceSummary,
  BalanceAmount,
  KPICards,
  KPICard,
  SparklineContainer,
  SectionTitle,
} from '../styles';
import { RootState } from '@/redux/store';

function generateInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function generateSparklineData(transactions: { createdAt: string; value: number }[]) {
  const dataMap: Record<string, number> = {};
  transactions.forEach(({ createdAt, value }) => {
    const date = new Date(createdAt).toISOString().slice(0, 10);
    dataMap[date] = (dataMap[date] || 0) + value;
  });

  const sortedDates = Object.keys(dataMap).sort();
  let accumulated = 0;
  return sortedDates.map((date) => {
    accumulated += dataMap[date];
    return { date, balance: accumulated };
  });
}

function isTransactionType(t: string, type: string) {
  return t.trim().toLowerCase() === type.trim().toLowerCase();
}

export function UserSummary() {
  const fullName = useSelector((state: RootState) => state.user.fullName || 'Usuário');
  const totalBalance = useSelector((state: RootState) => state.user.totalBalance || 0);
  const transactions = useSelector((state: RootState) => state.transactions.list || []);

  const initials = generateInitials(fullName);
  const sparklineData = generateSparklineData(transactions);

  const totalDeposit = transactions
    .filter((t) => isTransactionType(t.type, 'depósito'))
    .reduce((acc, t) => acc + t.value, 0);

  const totalWithdraw = transactions
    .filter((t) => isTransactionType(t.type, 'saque'))
    .reduce((acc, t) => acc + t.value, 0);

  const totalTransfer = transactions
    .filter((t) => isTransactionType(t.type, 'transferência'))
    .reduce((acc, t) => acc + t.value, 0);

  return (
    <HeaderSection style={{ flexWrap: 'wrap', gap: '2rem' }}>
      {/* Card Resumo principal */}
      <div
        style={{
          flex: '1 1 300px',
          background: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgb(0 0 0 / 0.05)',
        }}
      >
        {/* Linha superior: avatar + nome + saldo total */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <UserInfo style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Avatar>{initials}</Avatar>
            <UserName>{fullName}</UserName>
          </UserInfo>

          <BalanceSummary style={{ minWidth: '160px', textAlign: 'right' }}>
            <p>Saldo Total</p>
            <BalanceAmount>
              {totalBalance.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </BalanceAmount>
          </BalanceSummary>
        </div>

        {/* KPIs abaixo */}
        <KPICards style={{ marginTop: '1.5rem', justifyContent: 'flex-start' }}>
          <KPICard>
            <p>Entradas</p>
            <span>
              {totalDeposit.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </KPICard>

          <KPICard>
            <p>Saídas</p>
            <span>
              {totalWithdraw.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </KPICard>

          <KPICard>
            <p>Transferências</p>
            <span>
              {totalTransfer.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </KPICard>
        </KPICards>
      </div>

      {/* Card do gráfico sparkline */}
      <div
        style={{
          flex: '1 1 300px',
          background: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgb(0 0 0 / 0.05)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <SectionTitle style={{ marginBottom: '1rem' }}>Saldo ao longo do tempo</SectionTitle>
        <SparklineContainer>
          <div style={{ width: '100%', height: '60px', display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line type="monotone" dataKey="balance" stroke="#4B86B4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SparklineContainer>
      </div>
    </HeaderSection>
  );
}
