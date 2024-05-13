import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), UnoCSS()],
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
            '/official': {
                target: 'https://www.waseda.jp/',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/official/, ''),
            },
        },
    },
    esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
    },
    css: {
        modules: {
            localsConvention: 'camelCase',
        },
    },
})
