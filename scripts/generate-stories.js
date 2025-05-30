// scripts/generate-stories.js
const fs = require('fs');
const path = require('path');

const componentsDir = path.resolve(__dirname, '../src/app/components');

function createStoryContent(componentName) {
  return `import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: 'Components/${componentName}',
  component: ${componentName},
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {
  args: {},
};
`;
}

function generateStories(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      generateStories(fullPath);
    } else if (file.endsWith('.tsx') && !file.endsWith('.stories.tsx')) {
      const componentName = path.basename(file, '.tsx');
      const storyPath = path.join(dir, `${componentName}.stories.tsx`);

      if (!fs.existsSync(storyPath)) {
        const content = createStoryContent(componentName);
        fs.writeFileSync(storyPath, content, 'utf8');
        console.log(`Created story for: ${componentName}`);
      } else {
        console.log(`Story already exists for: ${componentName}, skipping.`);
      }
    }
  });
}

generateStories(componentsDir);
