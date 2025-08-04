'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { RootState } from '@/redux/store';
import { setPagination } from '@/redux/transactionTableSlice';

interface PaginationSectionProps {
  table: any; // React Table instance
}

export default function PaginationSection({ table }: PaginationSectionProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const pagination = useSelector((state: RootState) => state.transactionTable.pagination);

  const updatePage = (newPageIndex: number) => {
    const page = newPageIndex + 1;
    const pageSize = pagination.pageSize;

    // Atualiza Redux
    dispatch(setPagination({ pageIndex: newPageIndex, pageSize }));

    // Atualiza URL mantendo todos os filtros e parâmetros existentes
    const currentParams = new URLSearchParams(searchParams?.toString());

    currentParams.set('page', page.toString());
    currentParams.set('pageSize', pageSize.toString());

    router.push(`/transactions?${currentParams.toString()}`);
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => updatePage(pagination.pageIndex - 1)}
        disabled={pagination.pageIndex <= 0}
        aria-label="Página anterior"
      >
        Anterior
      </button>
      <span className="text-sm">
        Página{' '}
        <strong>
          {pagination.pageIndex + 1} de {table.getPageCount()}
        </strong>
      </span>
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => updatePage(pagination.pageIndex + 1)}
        disabled={!table.getCanNextPage()}
        aria-label="Próxima página"
      >
        Próxima
      </button>
    </div>
  );
}
