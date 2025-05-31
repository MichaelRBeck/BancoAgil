import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { UserHeader } from '../components/UserHeader';

const meta: Meta<typeof UserHeader> = {
  title: 'Homepage/UserHeader',
  component: UserHeader,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UserHeader>;

export const Default: Story = {
  args: {
    fullName: 'João Silva',
  },
};

export const NoUser: Story = {
  args: {
    fullName: undefined,
  },
};