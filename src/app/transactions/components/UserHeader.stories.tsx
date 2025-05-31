import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { UserHeader } from './UserHeader';

const meta: Meta<typeof UserHeader> = {
  title: 'Transactions/UserHeader',
  component: UserHeader,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UserHeader>;

export const WithUser: Story = {
  args: {
    user: {
      fullName: 'Maria Souza',
    } as any,
  },
};

export const NoUser: Story = {
  args: {
    user: null,
  },
};