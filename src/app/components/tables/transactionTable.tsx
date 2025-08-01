'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface TransactionTableProps {
  title?: string;
  limit?: number;
}

export default function TransactionTable({ title = 'Transações', limit }: TransactionTableProps) {
  const transactions = useSelector((state: RootState) => state.transactions.list);

  // pega as primeiras `limit` transações (mais recentes) ou todas se não tiver limit
  const displayedTransactions = React.useMemo(() => {
    if (!transactions) return [];
    return limit ? transactions.slice(0, limit) : transactions;
  }, [transactions, limit]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4 text-primary">{title}</h2>

      <div className="overflow-x-auto rounded-xl border border-accent shadow-sm">
        <table className="min-w-full text-left text-primary">
          <thead className="text-sm font-medium bg-neutral text-primary">
            <tr>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Valor</th>
              <th className="px-6 py-4">Data</th>
            </tr>
          </thead>
          <tbody>
            {displayedTransactions.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-secondary">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            ) : (
              displayedTransactions.map((tx) => (
                <tr key={tx._id} className="border-t text-sm hover:bg-[#ADCBE3] border-accent">
                  <td className="px-6 py-4">{tx.type}</td>
                  <td className="px-6 py-4">
                    {tx.value.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                  <td className="px-6 py-4">{new Date(tx.createdAt).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
