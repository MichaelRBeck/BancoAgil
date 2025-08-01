// components/tables/PaginationSection.tsx
'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setPagination } from '@/redux/transactionTableSlice';

interface PaginationSectionProps {
  table: any; // React Table instance
}

export default function PaginationSection({ table }: PaginationSectionProps) {
  const dispatch = useDispatch();
  const pagination = useSelector((state: RootState) => state.transactionTable.pagination);

  return (
    <div className="flex items-center justify-between mt-4">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        aria-label="Página anterior"
      >
        Anterior
      </button>
      <span className="text-sm">
        Página{' '}
        <strong>
          {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </strong>
      </span>
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        aria-label="Próxima página"
      >
        Próxima
      </button>
    </div>
  );
}
