import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate', // Tự động cập nhật app khi có code mới
      includeAssets: ['favicon.png'], // Mang theo file icon
      
      // THÊM ĐOẠN NÀY: ÉP HIỆN NÚT CÀI ĐẶT APP TRONG LÚC ĐANG CODE (npm run dev)
      devOptions: {
        enabled: true
      },

      manifest: {
        name: 'Du Lịch Việt - Đặt Tour',
        short_name: 'Du Lịch Việt',
        description: 'Ứng dụng đặt tour và tư vấn du lịch thông minh',
        theme_color: '#0dcaf0', // Màu xanh Info chủ đạo của bạn
        background_color: '#ffffff',
        display: 'standalone', // Quan trọng: Làm cho nó chạy giống app thật (mất thanh URL)
        icons: [
          {
            src: '/assets/img/icon/favicon.png', // Sử dụng icon sẵn có của bạn
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/assets/img/icon/favicon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})