'use client';

import { useState, useEffect, Fragment } from 'react';
import { AiOutlineInfoCircle, AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

// Tipos de props e dados da transação
interface Transaction {
  _id: string;
  type: string;
  value: number;
  createdAt: string;
  nameOrigin?: string;
  cpfOrigin?: string;
  nameDest?: string;
  cpfDest?: string;
}

interface TransactionTableProps {
  title: string;
  transactions: Transaction[];
  onTransactionUpdated: (updatedTransaction: Transaction) => void;
  editable?: boolean;
  loggedUserCpf?: string;
}

export default function DinamicTransactionTable({
  title,
  transactions,
  onTransactionUpdated,
  editable = false,
  loggedUserCpf = ''
}: TransactionTableProps) {
  const isTransfer = title === 'Transferências';

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState<string>('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>([]);

  // Atualiza as transações locais quando a lista de transações muda
  useEffect(() => {
    setLocalTransactions(transactions);
    setEditingId(null);
    setEditedValue('');
  }, [transactions]);

  // Alterna visibilidade dos detalhes da transação
  const toggleCollapse = (id: string) => {
    setExpandedRows(prev => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  // Inicia o modo de edição
  const handleEditClick = (id: string, currentValue: number) => {
    setEditingId(id);
    setEditedValue(currentValue.toString());
  };

  // Confirma a edição da transação
  const handleConfirmEdit = async (tx: Transaction) => {
    const newValNum = Number(editedValue);

    const isInvalid =
      editingId !== tx._id ||
      isNaN(newValNum) ||
      newValNum <= 0 ||
      newValNum === tx.value;

    if (isInvalid) {
      setEditingId(null);
      setEditedValue('');
      return;
    }

    try {
      const res = await fetch(`/api/transaction/${tx._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newValue: newValNum }),
      });

      if (res.ok) {
        const updatedTx = { ...tx, value: newValNum };
        onTransactionUpdated(updatedTx);
        setEditingId(null);
        setEditedValue('');
      } else {
        alert('Erro ao atualizar transação');
      }
    } catch (err) {
      alert('Erro na requisição');
      console.error('Erro na requisição:', err);
    }
  };

  // Exclui a transação
  const handleDelete = async (id: string) => {
    const confirmed = confirm('Deseja realmente excluir esta transação?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/transaction/${id}`, { method: 'DELETE' });

      if (res.ok) {
        setLocalTransactions(prev => prev.filter(t => t._id !== id));
      } else {
        alert('Erro ao excluir transação');
      }
    } catch (err) {
      alert('Erro na requisição');
      console.error('Erro na requisição:', err);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4 text-primary">{title}</h2>

      <div className="overflow-x-auto rounded-xl border border-accent shadow-sm">
        <table className="min-w-full text-left text-primary">
          <thead className="text-sm font-medium bg-neutral text-primary">
            <tr>
              {isTransfer && <th className="px-6 py-4">Nome Remetente</th>}
              {isTransfer && <th className="px-6 py-4">CPF Remetente</th>}
              <th className="px-6 py-4">Valor</th>
              <th className="px-6 py-4">Data</th>
              {isTransfer && <th className="px-6 py-4">CPF Destinatário</th>}
              {isTransfer && <th className="px-6 py-4">Nome Destinatário</th>}
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>

          <tbody>
            {localTransactions.length === 0 ? (
              <tr>
                <td colSpan={isTransfer ? 7 : 4} className="px-6 py-4 text-center text-secondary">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            ) : (
              localTransactions.map(tx => {
                const isEditing = editingId === tx._id;
                const isExpanded = expandedRows.has(tx._id);

                const canEdit = editable && (!isTransfer || tx.cpfOrigin === loggedUserCpf);

                return (
                  <Fragment key={tx._id}>
                    <tr className="border-t text-sm hover:bg-[#ADCBE3] border-accent">
                      {isTransfer && <td className="px-6 py-4">{tx.nameOrigin}</td>}
                      {isTransfer && <td className="px-6 py-4">{tx.cpfOrigin}</td>}
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            type="number"
                            min={1}
                            step={0.01}
                            value={editedValue}
                            onChange={e => setEditedValue(e.target.value)}
                            className="border rounded px-2 py-1 w-28 text-primary border-primary"
                            aria-label="Editar valor da transação"
                          />
                        ) : (
                          tx.value.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(tx.createdAt).toLocaleString('pt-BR')}
                      </td>
                      {isTransfer && <td className="px-6 py-4">{tx.cpfDest}</td>}
                      {isTransfer && <td className="px-6 py-4">{tx.nameDest}</td>}

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {isEditing ? (
                            <button
                              className="font-medium text-green-600 hover:underline"
                              onClick={() => handleConfirmEdit(tx)}
                            >
                              Confirmar
                            </button>
                          ) : (
                            <>
                              {canEdit && (
                                <>
                                  <button
                                    className="font-medium text-secondary hover:underline"
                                    onClick={() => handleEditClick(tx._id, tx.value)}
                                  >
                                    Editar
                                  </button>
                                  <button
                                    className="font-medium text-red-600 hover:underline"
                                    onClick={() => handleDelete(tx._id)}
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
                              >
                                <AiOutlineInfoCircle className="mr-1" size={18} />
                                {isExpanded ? <AiOutlineUp size={14} /> : <AiOutlineDown size={14} />}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr key={`${tx._id}-details`}>
                        <td colSpan={isTransfer ? 7 : 4} className="px-6 py-4 bg-neutral">
                          <div className="rounded-xl p-5 shadow-sm border border-accent bg-neutral">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
                              <AiOutlineInfoCircle size={20} />
                              Informações da Transação
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-primary">
                              <p>
                                <span className="font-semibold">Tipo:</span> {tx.type}
                              </p>
                              <p>
                                <span className="font-semibold">Data:</span>{' '}
                                {new Date(tx.createdAt).toLocaleString('pt-BR')}
                              </p>
                              <p>
                                <span className="font-semibold">Valor:</span>{' '}
                                {tx.value.toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                })}
                              </p>
                              {isTransfer && (
                                <>
                                  <p>
                                    <span className="font-semibold">Nome Remetente:</span>{' '}
                                    {tx.nameOrigin}
                                  </p>
                                  <p>
                                    <span className="font-semibold">CPF Remetente:</span>{' '}
                                    {tx.cpfOrigin}
                                  </p>
                                  <p>
                                    <span className="font-semibold">Nome Destinatário:</span>{' '}
                                    {tx.nameDest}
                                  </p>
                                  <p>
                                    <span className="font-semibold">CPF Destinatário:</span>{' '}
                                    {tx.cpfDest}
                                  </p>
                                </>
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
    </div>
  );
}
