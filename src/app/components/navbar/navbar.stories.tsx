import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import navbar from './navbar';

const meta: Meta<typeof navbar> = {
  title: 'Components/navbar',
  component: navbar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof navbar>;

export const Default: Story = {
  args: {},
};