import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import AutoImport from 'unplugin-auto-import/vite';
import EnvironmentPlugin from 'vite-plugin-environment';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    'process.env': process.env,
  },
  server: {
    host: "::",
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    minify: mode === 'production',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd', '@ant-design/icons'],
        },
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    AutoImport({
      imports: [
        'react',
        'react-router-dom',
        {
          'date-fns': [
            'format',
            'parseISO',
            'addDays',
            'isAfter',
            'isBefore',
          ],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
    }),
    // Add environment variables support
    EnvironmentPlugin('all', { prefix: 'VITE_' }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
