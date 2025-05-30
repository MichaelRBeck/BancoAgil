import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import homeNavbar from './homeNavbar';

const meta: Meta<typeof homeNavbar> = {
  title: 'Components/homeNavbar',
  component: homeNavbar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof homeNavbar>;

export const Default: Story = {
  args: {},
};
