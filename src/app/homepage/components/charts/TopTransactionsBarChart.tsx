'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Transaction } from '@/app/transactions/types/transaction';

interface Props {
  transactions: Transaction[];
}

export function TopTransactionsBarChart({ transactions }: Props) {
  // Top 5 maiores transações
  const topTransactions = [...transactions]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
    .map((t) => ({
      id: t._id,
      type: t.type,
      value: t.value,
      label: new Date(t.createdAt).toLocaleDateString('pt-BR'),
    }));

  if (topTransactions.length === 0) return <p>Nenhuma transação para exibir.</p>;

  return (
    <>
      <h3>Top 5 Maiores Transações</h3>
      <div
        style={{
          width: '100%',
          height: 250,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ResponsiveContainer width="95%" height="100%">
          <BarChart
            data={topTransactions}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 10, bottom: 5 }} // <- alterado de 70 para 50
          >

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="label" type="category" width={90} /> {/* ✅ Define largura suficiente */}
            <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
            <Bar dataKey="value" fill="#E3F2FD" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
