import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) {
              return 'three-vendor';
            }
            if (id.includes('@react-three/drei') || id.includes('@react-three/fiber')) {
              return 'react-three-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'framer-vendor';
            }
            return 'vendor';
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'three'],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  resolve: {
    mainFields: ['browser', 'module', 'main'],
  }
})