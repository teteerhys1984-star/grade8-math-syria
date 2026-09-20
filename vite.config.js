import { defineConfig } from 'vite';

export default defineConfig({
  base: '/grade8-math-syria/',
  server: {
    host: '0.0.0.0',
    allowedHosts: true
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true
  }
});
