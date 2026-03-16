import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Hoặc plugin framework bạn đang dùng
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})