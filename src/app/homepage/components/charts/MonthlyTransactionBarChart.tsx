'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Transaction } from '@/app/transactions/types/transaction';

interface Props {
  transactions: Transaction[];
}

interface MonthlyData {
  month: string;
  total: number;
}

export function MonthlyTransactionBarChart({ transactions }: Props) {
  // Agrega o total de transações por mês (exemplo simples)
  const monthlyMap: Record<string, number> = {};

  transactions.forEach((t) => {
    const d = new Date(t.createdAt);
    const month = d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    monthlyMap[month] = (monthlyMap[month] || 0) + t.value;
  });

  const monthlyData: MonthlyData[] = Object.entries(monthlyMap)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  if (monthlyData.length === 0) return <p>Nenhuma transação para exibir no gráfico mensal.</p>;

  return (
    <>
      <h3>Transações Mensais</h3>
      <div style={{ width: '100%', height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ResponsiveContainer width="95%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
            <Bar dataKey="total" fill="#4B86B4" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
