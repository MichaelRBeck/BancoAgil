import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import TotalBalanceCard from './TotalBalanceCard';

const meta: Meta<typeof TotalBalanceCard> = {
  title: 'Transactions/TotalBalanceCard',
  component: TotalBalanceCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TotalBalanceCard>;

export const Default: Story = {
  args: {
    user: {
      totalBalance: 12345.67,
    } as any,
  },
};

export const NoUser: Story = {
  args: {
    user: null,
  },
};