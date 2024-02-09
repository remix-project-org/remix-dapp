import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import polyfillNode from 'rollup-plugin-polyfill-node';

// https://vitejs.dev/config/
const viteConfig = ({ mode }: any) => {
  process.env = { ...process.env, ...loadEnv(mode, '', '') };
  return defineConfig({
    // define: {
    //   'process.env': process.env,
    // },
    plugins: [react()],
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
          }),
        ],
      },
    },
    build: {
      rollupOptions: {
        plugins: [polyfillNode()],
      },
    },
    // resolve: {
    //   alias: {
    //     events: 'events',
    //     crypto: 'crypto-browserify',
    //     stream: 'stream-browserify',
    //     http: 'stream-http',
    //     https: 'https-browserify',
    //     ws: 'xrpl/dist/npm/client/WSWrapper',
    //   },
    // },
  });
};

export default viteConfig;
