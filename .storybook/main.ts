import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../src/app/homepage/components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../src/app/transactions/components/**/*.stories.@(js|jsx|ts|tsx|mdx)'
  ],
  addons: ['@storybook/addon-essentials', '@storybook/addon-links'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  },
  webpackFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'next/navigation': path.resolve(__dirname, 'next-router-mock.ts'),
      '@': path.resolve(__dirname, '../src')
    };

    if (config.module && Array.isArray(config.module.rules)) {
      config.module.rules = config.module.rules.filter((rule) => {
        if (!rule || typeof rule !== 'object' || !('test' in rule)) return true;
        const test = (rule as any).test;
        if (typeof test === 'undefined') return true;
        return !(test.toString().includes('tsx') || test.toString().includes('ts'));
      });
    }

    if (config.module && Array.isArray(config.module.rules)) {
      config.module.rules.push({
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            }
          }
        ]
      });
    }

    return config;
  }
};

export default config;
