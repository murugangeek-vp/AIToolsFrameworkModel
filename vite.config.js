import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        tailwindcss(),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@layouts': path.resolve(__dirname, './src/layouts'),
            '@charts': path.resolve(__dirname, './src/charts'),
            '@dashboards': path.resolve(__dirname, './src/dashboards'),
            '@hooks': path.resolve(__dirname, './src/hooks'),
            '@services': path.resolve(__dirname, './src/services'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@store': path.resolve(__dirname, './src/store'),
            '@types-app': path.resolve(__dirname, './src/types'),
            '@filters': path.resolve(__dirname, './src/filters'),
            '@styles': path.resolve(__dirname, './src/styles'),
        },
    },
    build: {
        target: 'esnext',
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'recharts', 'framer-motion'],
    },
});
