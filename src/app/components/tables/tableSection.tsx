'use client';

import React, { Fragment, useState, useEffect } from 'react';
import { AiOutlineInfoCircle, AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { openModal } from '@/redux/transactionModalSlice';
import type { Transaction } from '../../transactions/types/transaction';
import { flexRender } from '@tanstack/react-table';
import type { Table } from '@tanstack/react-table';

interface TableSectionProps {
  table: Table<Transaction>;
  columnsLength: number;
  editable: boolean;
  loggedUserCpf: string;
  onTransactionUpdated: (updatedTx: Transaction) => void;
  onTransactionDeleted: (deletedId: string) => void;
  title?: string;
}

export default function TableSection({
  table,
  columnsLength,
  editable,
  loggedUserCpf,
  onTransactionUpdated,
  onTransactionDeleted,
  title,
}: TableSectionProps) {
  const dispatch = useDispatch();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    setExpandedRows(new Set());
  }, [table.getRowModel().rows]);

  const toggleCollapse = (id: string) => {
    setExpandedRows((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) updated.delete(id);
      else updated.add(id);
      return updated;
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta transação?')) return;
    try {
      const res = await fetch(`/api/transaction/${id}`, { method: 'DELETE' });
      if (res.ok) onTransactionDeleted(id);
      else alert('Erro ao excluir transação.');
    } catch (error) {
      alert('Erro na requisição.');
      console.error(error);
    }
  };

  const handleOpenModalEdit = (tx: Transaction) => {
    dispatch(openModal({ transaction: tx }));
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-accent shadow-sm mt-10">
      {title && (
        <h2 className="text-2xl font-semibold px-6 pt-6 text-primary">{title}</h2>
      )}
      <table className="min-w-full text-left text-primary">
        <thead className="text-sm font-medium bg-neutral text-primary">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan} className="px-6 py-4">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columnsLength}
                className="px-6 py-4 text-center text-secondary"
              >
                Nenhuma transação encontrada.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => {
              const tx = row.original;
              const isExpanded = expandedRows.has(tx._id);
              const canEdit =
                editable && (tx.type !== 'Transferência' || tx.cpfOrigin === loggedUserCpf);

              return (
                <Fragment key={tx._id}>
                  <tr className="border-t text-sm hover:bg-[#ADCBE3] border-accent">
                    {row.getVisibleCells().map((cell) => {
                      if (cell.column.id === 'actions') {
                        return (
                          <td key={cell.id} className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              {canEdit && (
                                <>
                                  <button
                                    className="font-medium text-secondary hover:underline"
                                    onClick={() => handleOpenModalEdit(tx)}
                                    aria-label={`Editar transação ${tx._id}`}
                                  >
                                    Editar
                                  </button>

                                  <button
                                    className="font-medium text-red-600 hover:underline"
                                    onClick={() => handleDelete(tx._id)}
                                    aria-label={`Excluir transação ${tx._id}`}
                                  >
                                    Excluir
                                  </button>
                                </>
                              )}

                              <button
                                className="flex items-center text-secondary hover:underline"
                                onClick={() => toggleCollapse(tx._id)}
                                title="Ver mais informações"
                                aria-expanded={isExpanded}
                                aria-controls={`${tx._id}-details`}
                              >
                                <AiOutlineInfoCircle className="mr-1" size={18} />
                                {isExpanded ? <AiOutlineUp size={14} /> : <AiOutlineDown size={14} />}
                              </button>
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td key={cell.id} className="px-6 py-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>

                  {isExpanded && (
                    <tr key={`${tx._id}-details`}>
                      <td colSpan={columnsLength} className="px-6 py-4 bg-neutral">
                        <div className="rounded-xl p-5 shadow-sm border border-accent bg-neutral">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
                            <AiOutlineInfoCircle size={20} />
                            Informações da Transação
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-primary">
                            <p>
                              <span className="font-semibold">Tipo:</span> {tx.type || '—'}
                            </p>
                            <p>
                              <span className="font-semibold">Data:</span>{' '}
                              {tx.createdAt
                                ? new Date(tx.createdAt).toLocaleString('pt-BR')
                                : '—'}
                            </p>
                            <p>
                              <span className="font-semibold">Valor:</span>{' '}
                              {typeof tx.value === 'number'
                                ? tx.value.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  })
                                : '—'}
                            </p>

                            {tx.type === 'Transferência' && (
                              <>
                                <p>
                                  <span className="font-semibold">Nome Remetente:</span>{' '}
                                  {tx.nameOrigin || '—'}
                                </p>
                                <p>
                                  <span className="font-semibold">CPF Remetente:</span>{' '}
                                  {tx.cpfOrigin || '—'}
                                </p>
                                <p>
                                  <span className="font-semibold">Nome Destinatário:</span>{' '}
                                  {tx.nameDest || '—'}
                                </p>
                                <p>
                                  <span className="font-semibold">CPF Destinatário:</span>{' '}
                                  {tx.cpfDest || '—'}
                                </p>
                              </>
                            )}

                            {tx.attachment && typeof tx.attachment === 'string' && (
                              <div className="col-span-full mt-4">
                                <span className="font-semibold">Anexo:</span>
                                <div className="mt-2">
                                  {tx.attachment.startsWith('data:image/') ? (
                                    <img
                                      src={tx.attachment}
                                      alt={
                                        typeof tx.attachmentName === 'string'
                                          ? tx.attachmentName
                                          : 'Anexo da transação'
                                      }
                                      className="max-w-full max-h-60 rounded"
                                    />
                                  ) : tx.attachment.startsWith('data:application/pdf') ? (
                                    <iframe
                                      src={tx.attachment}
                                      title="Anexo PDF"
                                      className="w-full h-96 border rounded"
                                    />
                                  ) : (
                                    <a
                                      href={tx.attachment}
                                      download={
                                        typeof tx.attachmentName === 'string'
                                          ? tx.attachmentName
                                          : `anexo-transacao-${tx._id}`
                                      }
                                      className="text-blue-600 underline"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Baixar anexo
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
