'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  FilterFn,
  CellContext,
} from '@tanstack/react-table';

import { RootState, AppDispatch } from '@/redux/store';
import {
  setColumnFilters,
  setPagination,
  setCpfFilter,
} from '@/redux/transactionTableSlice';

import { openModal, closeModal } from '@/redux/transactionModalSlice';

import type { Transaction } from '@/app/transactions/types/transaction';

import Filters from './filters';
import PaginationSection from './paginationSection';
import TableSection from './tableSection';
import TransactionModal from '../modals/transactionModal';

// Filtro para valor entre min e max
const filtroValorIntervalo: FilterFn<Transaction> = (row, columnId, filterValue) => {
  if (!filterValue) return true;
  const { min, max } = filterValue as { min?: number; max?: number };
  const valor = row.getValue(columnId) as number;
  if (min !== undefined && valor < min) return false;
  if (max !== undefined && valor > max) return false;
  return true;
};

// Filtro para intervalo de datas (inclui todo o dia final)
const filtroDataIntervalo: FilterFn<Transaction> = (row, columnId, filterValue) => {
  if (!filterValue) return true;

  const { startDate, endDate } = filterValue as { startDate?: string; endDate?: string };
  const rowDate = new Date(row.getValue(columnId));
  const rowTimestamp = rowDate.getTime();

  if (startDate) {
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    const startUtc = Date.UTC(startYear, startMonth - 1, startDay);
    if (rowTimestamp < startUtc) return false;
  }

  if (endDate) {
    const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
    const endUtc = Date.UTC(endYear, endMonth - 1, endDay + 1);
    if (rowTimestamp >= endUtc) return false;
  }

  return true;
};

interface DinamicTransactionTableProps {
  title: string;
  editable: boolean;
  onTransactionUpdated: (updatedTx: Transaction) => void;
  onTransactionDeleted: (deletedId: string) => void;
  transactions: Transaction[];
}

export default function DinamicTransactionTable({
  title,
  editable,
  onTransactionUpdated,
  onTransactionDeleted,
  transactions,
}: DinamicTransactionTableProps) {
  const dispatch = useDispatch<AppDispatch>();

  const columnFilters = useSelector((state: RootState) => state.transactionTable.columnFilters);
  const pagination = useSelector((state: RootState) => state.transactionTable.pagination);

  const modalOpen = useSelector((state: RootState) => state.transactionModal.isOpen);
  const transactionToEdit = useSelector((state: RootState) => state.transactionModal.transactionToEdit);

  const cpfFilter = useSelector((state: RootState) => state.transactionTable.cpfFilter);
  const valorMin = useSelector((state: RootState) => state.transactionTable.valorMin);
  const valorMax = useSelector((state: RootState) => state.transactionTable.valorMax);
  const dataInicio = useSelector((state: RootState) => state.transactionTable.dataInicio);
  const dataFim = useSelector((state: RootState) => state.transactionTable.dataFim);

  const loggedUserIdFromRedux = useSelector((state: RootState) => state.user?.id || null);
  const loggedUserCpf = useSelector((state: RootState) => state.user?.cpf || '');

  const [loggedUserId, setLoggedUserId] = useState<string | null>(null);

  useEffect(() => {
    if (loggedUserIdFromRedux) {
      setLoggedUserId(loggedUserIdFromRedux);
    } else if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('authUserId');
      setLoggedUserId(savedId);
    }
  }, [loggedUserIdFromRedux]);

  const tipoFiltroAtual = (columnFilters.find((f) => f.id === 'type')?.value as string) ?? '';
  const isTransfer = tipoFiltroAtual === 'Transferência';

  const columnFiltersRef = useRef(columnFilters);
  useEffect(() => {
    columnFiltersRef.current = columnFilters;
  }, [columnFilters]);

  // Atualiza filtro valor (min e max)
  useEffect(() => {
    const newFilters = columnFiltersRef.current.filter((f) => f.id !== 'value');

    if (valorMin !== '' || valorMax !== '') {
      newFilters.push({
        id: 'value',
        value: {
          min: valorMin !== '' ? +valorMin : undefined,
          max: valorMax !== '' ? +valorMax : undefined,
        },
      });
    }

    const isDifferent =
      newFilters.length !== columnFiltersRef.current.length ||
      newFilters.some(
        (f, i) =>
          f.id !== columnFiltersRef.current[i]?.id ||
          JSON.stringify(f.value) !== JSON.stringify(columnFiltersRef.current[i]?.value)
      );

    if (isDifferent) {
      dispatch(setColumnFilters(newFilters));
    }
  }, [valorMin, valorMax, dispatch]);

  // Atualiza filtro data (início e fim)
  useEffect(() => {
    const newFilters = columnFiltersRef.current.filter((f) => f.id !== 'createdAt');

    if (dataInicio !== '' || dataFim !== '') {
      newFilters.push({
        id: 'createdAt',
        value: {
          startDate: dataInicio !== '' ? dataInicio : undefined,
          endDate: dataFim !== '' ? dataFim : undefined,
        },
      });
    }

    const isDifferent =
      newFilters.length !== columnFiltersRef.current.length ||
      newFilters.some(
        (f, i) =>
          f.id !== columnFiltersRef.current[i]?.id ||
          JSON.stringify(f.value) !== JSON.stringify(columnFiltersRef.current[i]?.value)
      );

    if (isDifferent) {
      dispatch(setColumnFilters(newFilters));
    }
  }, [dataInicio, dataFim, dispatch]);

  useEffect(() => {
    if (!isTransfer) {
      dispatch(setCpfFilter(''));
      const filtered = columnFiltersRef.current.filter((f) => f.id !== 'cpfFilter');
      if (filtered.length !== columnFiltersRef.current.length) {
        dispatch(setColumnFilters(filtered));
      }
    }
  }, [isTransfer, dispatch]);

  const filtroCpfTransferencia: FilterFn<Transaction> = (row) => {
    if (!cpfFilter) return true;
    const cpf = cpfFilter.trim();
    return [row.getValue('cpfOrigin'), row.getValue('cpfDest')].some(
      (val) => typeof val === 'string' && val.includes(cpf)
    );
  };

  const columns: ColumnDef<Transaction>[] = [
    ...(isTransfer
      ? [
        {
          accessorKey: 'nameOrigin',
          header: 'Nome Remetente',
        },
        {
          id: 'cpfFilter',
          accessorFn: (row: Transaction) => row.cpfOrigin || '',
          header: 'Filtro CPF',
          filterFn: filtroCpfTransferencia,
          cell: () => null,
        },
        {
          id: 'cpfOrigin',
          accessorKey: 'cpfOrigin',
          header: () => null,
          cell: () => null,
          enableColumnFilter: true,
          enableSorting: false,
        },
        {
          id: 'cpfDest',
          accessorKey: 'cpfDest',
          header: () => null,
          cell: () => null,
          enableColumnFilter: true,
          enableSorting: false,
        },
      ]
      : []),
    {
      accessorKey: 'type',
      header: 'Tipo',
      filterFn: 'includesString',
    },
    {
      accessorKey: 'value',
      header: 'Valor',
      filterFn: filtroValorIntervalo,
      cell: (info: CellContext<Transaction, unknown>) => {
        const valor = info.getValue();
        if (typeof valor === 'number') {
          return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
        return '—';
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Data',
      filterFn: filtroDataIntervalo,
      cell: (info: CellContext<Transaction, unknown>) => {
        const valor = info.getValue();
        if (typeof valor === 'string' || typeof valor === 'number' || valor instanceof Date) {
          const date = new Date(valor);
          return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('pt-BR');
        }
        return '—';
      },

    },
    ...(isTransfer
      ? [
        {
          accessorKey: 'nameDest',
          header: 'Nome Destinatário',
        },
      ]
      : []),
    {
      id: 'actions',
      header: 'Ações',
      cell: (info: CellContext<Transaction, unknown>) => {
        const tx = info.row.original;
        const canEdit = tx.type !== 'Transferência' || tx.cpfOrigin === loggedUserCpf;
        return (
          <div className="flex items-center justify-end gap-3">
            {editable && canEdit && (
              <button
                className="font-medium text-secondary hover:underline"
                onClick={() => dispatch(openModal({ transaction: tx }))}
              >
                Editar
              </button>
            )}
            <button
              className="font-medium text-red-600 hover:underline"
              onClick={async () => {
                if (!confirm('Deseja realmente excluir esta transação?')) return;
                const res = await fetch(`/api/transaction/${tx._id}`, { method: 'DELETE' });
                alert(res.ok ? 'Transação excluída' : 'Erro ao excluir transação');
                if (res.ok) onTransactionDeleted(tx._id);
              }}
            >
              Excluir
            </button>
          </div>
        );
      },
    },
  ];

  // Memorize handlers to avoid infinite update loop
  const onColumnFiltersChange = useCallback(
    (updater: any) => {
      const newFilters =
        typeof updater === 'function' ? updater(columnFilters) : updater;

      const isEqual =
        newFilters.length === columnFilters.length &&
        newFilters.every((f: any, i: number) =>
          f.id === columnFilters[i]?.id &&
          JSON.stringify(f.value) === JSON.stringify(columnFilters[i]?.value)
        );

      if (!isEqual) {
        dispatch(setColumnFilters(newFilters));
      }
    },
    [columnFilters, dispatch]
  );

  const onPaginationChange = useCallback(
    (updater: any) => {
      const newPagination =
        typeof updater === 'function' ? updater(pagination) : updater;

      if (
        newPagination.pageIndex !== pagination.pageIndex ||
        newPagination.pageSize !== pagination.pageSize
      ) {
        dispatch(setPagination(newPagination));
      }
    },
    [pagination, dispatch]
  );

  const table = useReactTable({
    data: [...transactions], // clone para garantir imutabilidade
    columns,
    state: { columnFilters, pagination },
    onColumnFiltersChange,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleSave = async (updatedTransaction: Transaction) => {
    handleClose();
    onTransactionUpdated(updatedTransaction);
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4 text-primary">{title}</h2>

      <Filters isTransfer={isTransfer} table={table} />

      <TableSection
        table={table}
        columnsLength={columns.length}
        editable={editable}
        loggedUserCpf={loggedUserCpf}
        onTransactionUpdated={onTransactionUpdated}
        onTransactionDeleted={onTransactionDeleted}
        title={title}
      />

      <PaginationSection table={table} />

      {modalOpen && transactionToEdit && (
        <TransactionModal
          userId={loggedUserId}
          transactionToEdit={transactionToEdit}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
