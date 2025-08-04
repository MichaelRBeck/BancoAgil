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
  Updater,
  PaginationState,
  ColumnFiltersState,
} from '@tanstack/react-table';

import { RootState, AppDispatch } from '@/redux/store';
import {
  setColumnFilters,
  setPagination,
  setCpfFilter,
  setTransactionsList,
} from '@/redux/transactionTableSlice';

import { openModal, closeModal } from '@/redux/transactionModalSlice';
import type { Transaction } from '@/app/transactions/types/transaction';

import Filters from './filters';
import PaginationSection from './paginationSection';
import TableSection from './tableSection';
import TransactionModal from '../modals/transactionModal';

const filtroValorIntervalo: FilterFn<Transaction> = (row, columnId, filterValue) => {
  if (!filterValue) return true;
  const { min, max } = filterValue as { min?: number; max?: number };
  const valor = row.getValue(columnId) as number;
  if (min !== undefined && valor < min) return false;
  if (max !== undefined && valor > max) return false;
  return true;
};

const filtroDataIntervalo: FilterFn<Transaction> = (row, columnId, filterValue) => {
  if (!filterValue) return true;

  const { startDate, endDate } = filterValue as { startDate?: string; endDate?: string };
  const rawValue = row.getValue(columnId);
  if (!rawValue || typeof rawValue !== 'string') return true;

  const rowDate = new Date(rawValue);
  const rowTimestamp = rowDate.getTime();

  if (startDate) {
    const [y, m, d] = startDate.split('-').map(Number);
    const min = Date.UTC(y, m - 1, d);
    if (rowTimestamp < min) return false;
  }

  if (endDate) {
    const [y, m, d] = endDate.split('-').map(Number);
    const max = Date.UTC(y, m - 1, d + 1);
    if (rowTimestamp >= max) return false;
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
  const {
    columnFilters,
    pagination: paginationRedux,
    list: transactionsRedux,
    cpfFilter,
    valorMin,
    valorMax,
    dataInicio,
    dataFim,
  } = useSelector((state: RootState) => state.transactionTable);

  const { id: loggedUserIdFromRedux, cpf: loggedUserCpf } = useSelector(
    (state: RootState) => state.user
  );

  const modalOpen = useSelector((state: RootState) => state.transactionModal.isOpen);
  const transactionToEdit = useSelector((state: RootState) => state.transactionModal.transactionToEdit);

  const [loggedUserId, setLoggedUserId] = useState<string | null>(null);

  const previousQueryRef = useRef('');

  useEffect(() => {
    if (loggedUserIdFromRedux) {
      setLoggedUserId(loggedUserIdFromRedux);
    } else if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('authUserId');
      setLoggedUserId(savedId);
    }
  }, [loggedUserIdFromRedux]);
  

  useEffect(() => {
    if (!loggedUserId) return;

    const params = new URLSearchParams({
      userId: loggedUserId,
      page: (paginationRedux.pageIndex + 1).toString(),
      pageSize: paginationRedux.pageSize.toString(),
    });

    const tipo = columnFilters.find((f) => f.id === 'type')?.value;
    if (tipo) params.append('type', tipo);
    if (cpfFilter) params.append('search', cpfFilter);
    if (valorMin) params.append('valorMin', valorMin);
    if (valorMax) params.append('valorMax', valorMax);
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);

    const query = params.toString();
    if (previousQueryRef.current === query) return;
    previousQueryRef.current = query;

    const fetchPaginatedTransactions = async () => {
      try {
        const res = await fetch(`/api/transaction?${query}`);
        const json = await res.json();

        if (Array.isArray(json.transactions)) {
          dispatch(setTransactionsList(json.transactions));
          dispatch(setPagination({
            ...paginationRedux,
            totalCount: json.totalCount,
          }));
        } else {
          console.warn('Resposta inesperada da API:', json);
        }
      } catch (err) {
        console.error('Erro ao buscar transações paginadas com filtros:', err);
      }
    };

    fetchPaginatedTransactions();
  }, [
    paginationRedux.pageIndex,
    paginationRedux.pageSize,
    columnFilters,
    cpfFilter,
    valorMin,
    valorMax,
    dataInicio,
    dataFim,
    dispatch,
    loggedUserId,
  ]);

  const columnFiltersRef = useRef<ColumnFiltersState>([]);
  useEffect(() => {
    columnFiltersRef.current = columnFilters;
  }, [columnFilters]);

  const tipoFiltroAtual = columnFilters.find((f) => f.id === 'type')?.value as string;
  const isTransfer = tipoFiltroAtual === 'Transferência';

  // Sincronização com Redux de filtros complexos
  useEffect(() => {
    const newFilters = columnFiltersRef.current.filter((f) => f.id !== 'value');

    if (valorMin || valorMax) {
      newFilters.push({
        id: 'value',
        value: {
          min: valorMin ? +valorMin : undefined,
          max: valorMax ? +valorMax : undefined,
        },
      });
    }

    dispatch(setColumnFilters(newFilters));
  }, [valorMin, valorMax, dispatch]);

  useEffect(() => {
    const newFilters = columnFiltersRef.current.filter((f) => f.id !== 'createdAt');

    if (dataInicio || dataFim) {
      newFilters.push({
        id: 'createdAt',
        value: {
          startDate: dataInicio || undefined,
          endDate: dataFim || undefined,
        },
      });
    }

    dispatch(setColumnFilters(newFilters));
  }, [dataInicio, dataFim, dispatch]);

  useEffect(() => {
    if (!isTransfer) {
      dispatch(setCpfFilter(''));
      const filtered = columnFiltersRef.current.filter((f) => f.id !== 'cpfFilter');
      dispatch(setColumnFilters(filtered));
    }
  }, [isTransfer, dispatch]);

  const filtroCpfTransferencia: FilterFn<Transaction> = (row) => {
    if (!cpfFilter) return true;
    const cpf = cpfFilter.trim();
    return ['cpfOrigin', 'cpfDest'].some((field) => {
      const value = row.getValue(field);
      return typeof value === 'string' && value.includes(cpf);
    });
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
        return typeof valor === 'number'
          ? valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          : '—';
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Data',
      filterFn: filtroDataIntervalo,
      cell: (info: CellContext<Transaction, unknown>) => {
        const raw = info.getValue();
        const date = new Date(raw as string | number | Date);
        return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('pt-BR');
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
      cell: (info) => {
        const tx = info.row.original;
        const canEdit = tx.type !== 'Transferência' || tx.cpfOrigin === loggedUserCpf;
        return (
          <div className="flex justify-end gap-3">
            {editable && canEdit && (
              <button
                className="text-blue-600 hover:underline"
                onClick={() => dispatch(openModal({ transaction: tx }))}
              >
                Editar
              </button>
            )}
            <button
              className="text-red-600 hover:underline"
              onClick={async () => {
                if (!confirm('Deseja excluir esta transação?')) return;
                const res = await fetch(`/api/transaction/${tx._id}`, { method: 'DELETE' });
                alert(res.ok ? 'Transação excluída' : 'Erro ao excluir');
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

  const onColumnFiltersChange = useCallback(
    (updater: Updater<ColumnFiltersState>) => {
      const newFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
      dispatch(setColumnFilters(newFilters));
    },
    [columnFilters, dispatch]
  );

  const onPaginationChange = useCallback(
    (updater: Updater<PaginationState>) => {
      const newPagination = typeof updater === 'function' ? updater(paginationRedux) : updater;
      dispatch(setPagination(newPagination));
    },
    [paginationRedux, dispatch]
  );

  const table = useReactTable({
    data: transactionsRedux,
    columns,
    state: { columnFilters, pagination: paginationRedux },
    onColumnFiltersChange,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(paginationRedux.totalCount / paginationRedux.pageSize),
  });

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4 text-primary">{title}</h2>
      <Filters isTransfer={isTransfer} table={table} />
      <TableSection
        table={table}
        columnsLength={columns.length}
        editable={editable}
        loggedUserCpf={loggedUserCpf || ''}
        onTransactionUpdated={onTransactionUpdated}
        onTransactionDeleted={onTransactionDeleted}
        title={title}
      />

      <PaginationSection table={table} />
      {modalOpen && transactionToEdit && (
        <TransactionModal
          userId={loggedUserId}
          transactionToEdit={transactionToEdit}
          onClose={() => dispatch(closeModal())}
          onSave={(tx) => {
            dispatch(closeModal());
            onTransactionUpdated(tx);
          }}
        />
      )}
    </div>
  );
}
