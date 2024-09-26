import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'C:/Windows/System32/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'C:/Windows/System32/cert.pem')),
    },
    port: 5174, // Ensure this matches the port your frontend runs on
  },
});