import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import registerModal from './registerModal';

const meta: Meta<typeof registerModal> = {
  title: 'Components/Modals/registerModal',
  component: registerModal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof registerModal>;

export const Default: Story = {
  args: {},
};
