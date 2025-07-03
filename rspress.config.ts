import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Ziyy',
  icon: '/ziyy-icon.png',
  logo: {
    light: '/ziyy-icon.png',
    dark: '/ziyy-icon.png',
  },
  themeConfig: {
    enableAppearanceAnimation: false,
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/ziyy-dev',
      },
    ],
  },
  globalStyles: path.join(__dirname, 'styles/index.css'),
});
