import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  build: {
    outDir: './dist',
    emptyOutDir: true,
  },
  server: {
    port: 3001
  }
}) 