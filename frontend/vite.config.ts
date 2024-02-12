import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { number } from 'zod';

// https://vitejs.dev/config/

export default ({mode}) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  const POKEDEX_API_HOST = process.env.VITE_POKEDEX_HOST;
  const POKEDEX_API_PORT = process.env.VITE_POKEDEX_PORT;
  const FRONTEND_PROXY_PORT : number = Number(process.env.VITE_FRONTEND_PORT);

  return defineConfig({
    plugins: [react()],
    server: {
      watch: {
       usePolling: true,
      },
      host: true, // Here
      strictPort: true,
      port: FRONTEND_PROXY_PORT, 
      proxy: {
        '/api': {
          target: `${POKEDEX_API_HOST}:${POKEDEX_API_PORT}/api`,
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace('/api', ''),
        }
      }
    }
  });
}

