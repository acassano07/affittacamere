import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      optimizeDeps: {
        include: ['lucide-react'],
      },
      build: {
        cssCodeSplit: false, // Inlines all CSS into a single file
        rollupOptions: {
          output: {
            assetFileNames: (assetInfo) => {
              if (assetInfo.name === 'style.css') return 'assets/index.css';
              return 'assets/[name]-[hash][extname]';
            },
          },
        },
      },
    };
});
