import process from 'node:process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages بيخدم الموقع من /اسم-الريبو/ ، فالـ workflow بيمرّر المسار عبر BASE_PATH
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
});
