import path from 'path';
import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../src/app/homepage/components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../src/app/transactions/components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    // outros addons que usar
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (config) => {
    config.module = config.module || { rules: [] };
    config.module.rules = config.module.rules || [];

    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
          options: { transpileOnly: true },
        },
      ],
    });

    config.resolve = config.resolve || { extensions: [], alias: {} };
    config.resolve.extensions = config.resolve.extensions || [];
    config.resolve.alias = config.resolve.alias || {};

    config.resolve.extensions.push('.ts', '.tsx');

    // Adiciona alias para mockar next/navigation
    config.resolve.alias['next/navigation'] = path.resolve(
      __dirname,
      'next-router-mock.ts'
    );

    return config;
  },
};

export default config;
