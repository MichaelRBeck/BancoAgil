'use client';

import { useState, useEffect, Fragment } from 'react';
import { AiOutlineInfoCircle, AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

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
    const [editedValue, setEditedValue] = useState<number | null>(null);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [localTransactions, setLocalTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        setLocalTransactions(transactions);
    }, [transactions]);

    const toggleCollapse = (id: string) => {
        setExpandedRows(prev => {
            const updated = new Set(prev);
            updated.has(id) ? updated.delete(id) : updated.add(id);
            return updated;
        });
    };

    const handleEditClick = (id: string, currentValue: number) => {
        setEditingId(id);
        setEditedValue(currentValue);
    };

    const handleConfirmEdit = async (tx: Transaction) => {
        if (editedValue === null || editedValue === tx.value) {
            setEditingId(null);
            return;
        }

        try {
            const res = await fetch(`/api/transaction/${tx._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newValue: editedValue })
            });
            
            if (res.ok) {
                const updatedTx = { ...tx, value: editedValue };
                onTransactionUpdated(updatedTx);
                setEditingId(null);
            } else {
                console.error('Erro ao atualizar transação');
            }
        } catch (err) {
            console.error('Erro na requisição:', err);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmed = confirm("Deseja realmente excluir esta transação?");
        if (!confirmed) return;

        try {
            const res = await fetch(`/api/transaction/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setLocalTransactions(prev => prev.filter(t => t._id !== id));
            } else {
                alert("Erro ao excluir transação");
            }
        } catch (err) {
            console.error('Erro na requisição:', err);
        }
    };

    return (
        <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>{title}</h2>
            <div className="overflow-x-auto rounded-xl border shadow-sm" style={{ borderColor: 'var(--accent)' }}>
                <table className="min-w-full text-left" style={{ color: 'var(--primary)' }}>
                    <thead className="text-sm font-medium" style={{ backgroundColor: 'var(--neutral)', color: 'var(--primary)' }}>
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
                                <td colSpan={isTransfer ? 7 : 4} className="px-6 py-4 text-center" style={{ color: 'var(--secondary)' }}>
                                    Nenhuma transação encontrada.
                                </td>
                            </tr>
                        ) : (
                            localTransactions.map((tx) => {
                                const isEditing = editingId === tx._id;
                                const isExpanded = expandedRows.has(tx._id);

                                // Checagem para exibir botão editar em transferências só para remetente logado
                                const canEdit =
                                    editable &&
                                    (!isTransfer || // se não for transferência, pode editar (se editable)
                                        (isTransfer && tx.cpfOrigin === loggedUserCpf) // se for transferência, só se remetente for o usuário logado
                                    );

                                return (
                                    <Fragment key={tx._id}>
                                        <tr
                                            className="border-t text-sm hover:bg-[#ADCBE3]"
                                            style={{ borderColor: 'var(--accent)' }}
                                        >
                                            {isTransfer && <td className="px-6 py-4">{tx.nameOrigin}</td>}
                                            {isTransfer && <td className="px-6 py-4">{tx.cpfOrigin}</td>}
                                            <td className="px-6 py-4">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        value={editedValue ?? tx.value}
                                                        onChange={(e) => setEditedValue(Number(e.target.value))}
                                                        className="border rounded px-2 py-1 w-28"
                                                        style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                                                    />
                                                ) : (
                                                    tx.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                                                )}
                                            </td>
                                            <td className="px-6 py-4">{new Date(tx.createdAt).toLocaleString("pt-BR")}</td>
                                            {isTransfer && <td className="px-6 py-4">{tx.cpfDest}</td>}
                                            {isTransfer && <td className="px-6 py-4">{tx.nameDest}</td>}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    {isEditing ? (
                                                        <button
                                                            className="font-medium"
                                                            style={{ color: '#16a34a' }}
                                                            onClick={() => handleConfirmEdit(tx)}
                                                        >
                                                            Confirmar
                                                        </button>
                                                    ) : (
                                                        <>
                                                            {canEdit && (
                                                                <>
                                                                    <button
                                                                        className="font-medium"
                                                                        style={{ color: 'var(--secondary)' }}
                                                                        onClick={() => handleEditClick(tx._id, tx.value)}
                                                                    >
                                                                        Editar
                                                                    </button>
                                                                    <button
                                                                        className="font-medium"
                                                                        style={{ color: '#dc2626' }}
                                                                        onClick={() => handleDelete(tx._id)}
                                                                    >
                                                                        Excluir
                                                                    </button>
                                                                </>
                                                            )}
                                                            <button
                                                                className="flex items-center"
                                                                style={{ color: 'var(--secondary)' }}
                                                                onClick={() => toggleCollapse(tx._id)}
                                                                title="Ver mais informações"
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
                                                <td colSpan={isTransfer ? 7 : 4} className="px-6 py-4" style={{ backgroundColor: 'var(--neutral)' }}>
                                                    <div className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: 'var(--neutral)', border: '1px solid var(--accent)' }}>
                                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--primary)' }}>
                                                            <AiOutlineInfoCircle size={20} style={{ color: 'var(--primary)' }} />
                                                            Informações da Transação
                                                        </h3>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm" style={{ color: 'var(--primary)' }}>
                                                            <p><span className="font-semibold">Tipo:</span> {tx.type}</p>
                                                            <p><span className="font-semibold">Data:</span> {new Date(tx.createdAt).toLocaleString("pt-BR")}</p>
                                                            <p><span className="font-semibold">Valor:</span> {tx.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                                                            {isTransfer && (
                                                                <>
                                                                    <p><span className="font-semibold">Nome Remetente:</span> {tx.nameOrigin}</p>
                                                                    <p><span className="font-semibold">CPF Remetente:</span> {tx.cpfOrigin}</p>
                                                                    <p><span className="font-semibold">Nome Destinatário:</span> {tx.nameDest}</p>
                                                                    <p><span className="font-semibold">CPF Destinatário:</span> {tx.cpfDest}</p>
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
