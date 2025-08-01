'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Transaction } from '@/app/transactions/types/transaction';

interface Props {
  transactions: Transaction[];
}

interface DailyData {
  date: string;
  Depósito: number;
  Saque: number;
  Transferência: number;
}

export function DailyComparisonChart({ transactions }: Props) {
  const dailyMap: Record<string, DailyData> = {};

  transactions.forEach((t) => {
    const date = new Date(t.createdAt).toLocaleDateString('pt-BR');
    if (!dailyMap[date]) {
      dailyMap[date] = {
        date,
        Depósito: 0,
        Saque: 0,
        Transferência: 0,
      };
    }
    if (t.type === 'Depósito') dailyMap[date].Depósito += t.value;
    else if (t.type === 'Saque') dailyMap[date].Saque += t.value;
    else if (t.type === 'Transferência') dailyMap[date].Transferência += t.value;
  });

  const dailyData = Object.values(dailyMap).sort((a, b) => {
    const da = new Date(a.date.split('/').reverse().join('/')).getTime();
    const db = new Date(b.date.split('/').reverse().join('/')).getTime();
    return da - db;
  });

  if (dailyData.length === 0) return <p>Nenhuma transação registrada para o comparativo diário.</p>;

  return (
    <>
      <h3>Comparativo Diário</h3>
      <div style={{ width: '100%', height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ResponsiveContainer width="95%" height="100%">
          <BarChart data={dailyData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="Depósito" stackId="a" fill="#82ca9d" />
            <Bar dataKey="Saque" stackId="a" fill="#f87171" />
            <Bar dataKey="Transferência" stackId="a" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
