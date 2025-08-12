import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  
  build: {
    outDir: 'dist-react',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html')
    }
  },
  
  server: {
    port: 3000,
    host: '127.0.0.1',
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            if (req.url && req.url.includes('/api/files/download/')) {
              proxyReq.setHeader('Accept', '*/*');
              proxyReq.setHeader('Cache-Control', 'no-cache');
            }
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            if (req.url && req.url.includes('/api/files/download/')) {
              proxyRes.headers['access-control-allow-origin'] = '*';
              proxyRes.headers['access-control-expose-headers'] = 'Content-Disposition,Content-Length';
              delete proxyRes.headers['content-encoding'];
            }
          });
        }
      }
    }
  },
  
  base: './',
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@services': resolve(__dirname, 'src/services')
    }
  },
  
  define: {
    __API_URL__: JSON.stringify('http://127.0.0.1:5000')
  }
})