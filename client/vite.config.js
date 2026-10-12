import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
    "/api": {
       target: "http://localhost:4000",
       changeOrigin: true,
       secure: false
    },
    "/mediaforhome": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false
      },
      "/products": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false
      },
      "/mediaforpage": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false
      },
      "/media": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false
      },
      "/auth": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false
      }
  }
}
})
