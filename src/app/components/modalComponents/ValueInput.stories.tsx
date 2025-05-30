import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ValueInput from './ValueInput';

const meta: Meta<typeof ValueInput> = {
  title: 'Components/ValueInput',
  component: ValueInput,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ValueInput>;

export const Default: Story = {
  args: {},
};
