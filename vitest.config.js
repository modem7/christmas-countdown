import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // This project writes JSX in plain .js files (matching Next.js's SWC
  // convention), but Vite's default oxc transform excludes .js from JSX
  // parsing. Widen it so test files and the components they import work.
  oxc: {
    include: /\.(js|jsx|mjs|ts|tsx)$/,
    exclude: /node_modules/,
    lang: 'jsx',
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
  },
});
