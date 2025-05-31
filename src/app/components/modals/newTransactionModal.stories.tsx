import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import newTransactionModal from './newTransactionModal';

const meta: Meta<typeof newTransactionModal> = {
  title: 'Components/Modals/newTransactionModal',
  component: newTransactionModal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof newTransactionModal>;

export const Default: Story = {
  args: {},
};