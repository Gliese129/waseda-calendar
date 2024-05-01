import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    server: {
        port: 80,
        open: true,
        proxy: {
            '/syllabus': {
                target: 'https://www.wsl.waseda.jp/syllabus',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/syllabus/, ''),
            },
        },
    },
})
