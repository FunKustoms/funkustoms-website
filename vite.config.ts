import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Split chunks for better caching and parallel loading
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['bootstrap'],
          
          // Admin pages chunk (lazy loaded)
          'admin': [
            './src/pages/admin/AdminDashboard',
            './src/pages/admin/AdminProducts',
            './src/pages/admin/AdminUsers',
            './src/pages/admin/AdminCoupons',
            './src/pages/admin/AdminOrders',
            './src/pages/admin/AdminIntegrations',
            './src/pages/admin/AdminSettings',
            './src/pages/admin/AdminLogin',
          ],
          
          // Public pages chunk (lazy loaded)
          'public-pages': [
            './src/pages/Shop',
            './src/pages/Product',
            './src/pages/About',
            './src/pages/BulkOrders',
            './src/pages/Customize',
          ],
          
          // Checkout and cart chunk
          'commerce': [
            './src/pages/Cart',
            './src/pages/Checkout',
            './src/pages/Profile',
          ],
        },
      },
    },
    // Increase chunk size warnings to 600kb
    chunkSizeWarningLimit: 600,
  },
})
