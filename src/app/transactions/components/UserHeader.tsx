'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export function UserHeader() {
  const fullName = useSelector((state: RootState) => state.user.fullName || 'Usuário');

  return (
    <div className="flex flex-wrap justify-between gap-3 p-4 pl-0">
      <p className="min-w-[18rem] text-[28px] sm:text-[32px] font-bold leading-tight text-[#121714]">
        {fullName !== 'Usuário' ? `Olá, ${fullName}` : 'Usuário não encontrado'}
      </p>
    </div>
  );
}
