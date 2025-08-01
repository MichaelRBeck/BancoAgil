'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';

import { Transaction } from '@/app/transactions/types/transaction';

interface Props {
    transactions: Transaction[];
}

export function BalanceOverTimeChart({ transactions }: Props) {
    if (!transactions || transactions.length === 0) return null;

    const saldoAoLongoDoTempo = () => {
        const saldoPorData: Record<string, number> = {};
        let saldo = 0;

        const sorted = [...transactions].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        for (const tx of sorted) {
            const data = new Date(tx.createdAt).toLocaleDateString('pt-BR');
            const valor = tx.value;

            if (tx.type === 'Depósito') saldo += valor;
            else if (tx.type === 'Saque') saldo -= valor;
            else if (tx.type === 'Transferência') saldo -= valor;

            saldoPorData[data] = saldo;
        }

        return Object.entries(saldoPorData).map(([date, saldo]) => ({ date, saldo }));
    };

    const chartData = saldoAoLongoDoTempo();

    return (
        <>
            <h3 className="text-lg font-semibold mb-4 text-primary">Evolução do Saldo</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                    <Line type="monotone" dataKey="saldo" stroke="#4f46e5" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </>
    );
}
