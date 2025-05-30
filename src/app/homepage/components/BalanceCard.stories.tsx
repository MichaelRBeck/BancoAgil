import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BalanceCard } from '../components/BalanceCard';

const meta: Meta<typeof BalanceCard> = {
  title: 'Homepage/BalanceCard',
  component: BalanceCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BalanceCard>;

export const Default: Story = {
  args: {
    totalBalance: 12345.67,
  },
};

export const ZeroBalance: Story = {
  args: {
    totalBalance: 0,
  },
};

export const LargeBalance: Story = {
  args: {
    totalBalance: 987654321.12,
  },
};
