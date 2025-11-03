import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    svgr()
  ],
  server: {
    allowedHosts: ['3509cf3a7fe9.ngrok-free.app'], 
  }
})
