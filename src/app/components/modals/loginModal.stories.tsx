import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import LoginModal from './loginModal';

const meta: Meta<typeof LoginModal> = {
  title: 'Components/Modals/LoginModal',
  component: LoginModal,
};

export default meta;

type Story = StoryObj<typeof LoginModal>;

export const Default: Story = {
  args: {
    onClose: () => alert('Fechou o modal'),
  },
};