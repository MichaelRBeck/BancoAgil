import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import EditTransactionModal from './editTransactionModal';

const meta: Meta<typeof EditTransactionModal> = {
  title: 'Components/editTransactionModal',
  component: EditTransactionModal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EditTransactionModal>;

export const Default: Story = {
  args: {},
};
