import { defineConfig } from 'vite';

export default defineConfig({
  // Use relative asset paths to support flexible deployments (subfolders, local servers, static CDNs)
  base: './',
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Increase chunk size warning limit due to heavier code bundles if necessary
    chunkSizeWarningLimit: 1000
  }
});
