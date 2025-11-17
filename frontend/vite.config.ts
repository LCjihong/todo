import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        login: resolve(__dirname, 'login.html'),
        register: resolve(__dirname, 'register.html'),
        todos: resolve(__dirname, 'todos.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: '/login.html',
  },
});

