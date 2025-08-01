'use client';

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/app/transactions/types/transaction';

interface Props {
  transactions: Transaction[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

export function TransactionTypePieChart({ transactions }: Props) {
  const data = [
    {
      name: 'Depósito',
      value: transactions.filter((t) => t.type === 'Depósito').length,
    },
    {
      name: 'Saque',
      value: transactions.filter((t) => t.type === 'Saque').length,
    },
    {
      name: 'Transferência',
      value: transactions.filter((t) => t.type === 'Transferência').length,
    },
  ].filter((entry) => entry.value > 0);

  if (data.length === 0) return <p>Nenhuma transação registrada para exibir o gráfico.</p>;

  return (
    <>
      <h3>Distribuição de Transações</h3>
      <div style={{ width: '100%', height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ResponsiveContainer width="95%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                percent !== undefined ? `${name}: ${(percent * 100).toFixed(0)}%` : `${name}`
              }
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
