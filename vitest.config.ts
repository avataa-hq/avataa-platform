import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {
        environment: 'jsdom',
        mockReset: true,
        deps: {
          interopDefault: false,
        },
        css: true,
      },
    }),
  ),
);
