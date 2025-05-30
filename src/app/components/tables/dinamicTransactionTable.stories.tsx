import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DinamicTransactionTable from './dinamicTransactionTable';

const meta: Meta<typeof DinamicTransactionTable> = {
  title: 'Components/DinamicTransactionTable',
  component: DinamicTransactionTable,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DinamicTransactionTable>;

// Exemplo de dados mock para popular a tabela
const exampleTransactions = [
  {
    _id: '1',
    type: 'Depósito',
    value: 1500,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    type: 'Saque',
    value: 500,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
  },
  {
    _id: '3',
    type: 'Transferência',
    value: 1000,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
    nameOrigin: 'João Silva',
    cpfOrigin: '123.456.789-00',
    nameDest: 'Maria Oliveira',
    cpfDest: '987.654.321-00',
  },
];

export const Default: Story = {
  args: {
    title: 'Transações',
    transactions: exampleTransactions,
    onTransactionUpdated: (updatedTransaction) => {
      console.log('Transação atualizada:', updatedTransaction);
    },
    editable: true,
    loggedUserCpf: '123.456.789-00',
  },
};
