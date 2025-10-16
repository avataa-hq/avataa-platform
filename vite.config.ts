import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig(() => ({
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled', '@mui/material/Badge'],
  },
  envPrefix: 'REACT_APP_',
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: {
      'cron-input-ui/script': '/node_modules/cron-input-ui/dist/cron-input-ui.js',
      'cron-input-ui/styles': '/node_modules/cron-input-ui/dist/cron-input-ui.css',
      'cron-input-ui/locales-en': '/node_modules/cron-input-ui/dist/locales/en.js',
    },
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        ignore: ['node_modules/yoga-layout-prebuilt'],
        // Necessary for `components as selectors` styled-component feature. Other features that require this plugin: https://emotion.sh/docs/@emotion/babel-plugin
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    svgr({
      include: '**/*.svg?react',
    }),
    tsconfigPaths(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        dev: {
          logLevel: ['error'],
        },
      },
    }),
  ],
  assetsInclude: ['**/*.glb'],
  server: {
    allowedHosts: true as const,
    port: 3000,
    watch: {
      ignored: [
        '**/.env',
        '**/.env.local',
        '**/tsconfig.json',
        '**/tsconfig.node.json',
        '**/vite.config.ts',
      ],
    },
  },
}));
