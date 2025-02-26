import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic', // Ensures the new JSX transform is used
    }),
  ],
  server: {
    host: '0.0.0.0', // Bind to all network interfaces
    port: 5173,      // Optional: Set the port explicitly
    watch: {
      usePolling: true,
    },
  },
});