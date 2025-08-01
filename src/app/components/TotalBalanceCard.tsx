'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function TotalBalanceCard() {
  const totalBalance = useSelector((state: RootState) => state.user.totalBalance);

  return (
    <div className="w-full sm:w-80 rounded-xl border bg-white px-6 py-4 shadow-sm">
      <p className="font-medium text-gray-600">Valor Total</p>
      <p className="mt-2 text-3xl font-extrabold text-black">
        {totalBalance !== undefined
          ? totalBalance.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })
          : 'R$ 0,00'}
      </p>
    </div>
  );
}
