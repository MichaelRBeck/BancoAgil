import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import NewTransactionButton from '../components/NewTransactionButton';

const meta: Meta<typeof NewTransactionButton> = {
  title: 'Transactions/NewTransactionButton',
  component: NewTransactionButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NewTransactionButton>;

export const Default: Story = {
  args: {
    userId: 'storybook-user-id',
  },
};
