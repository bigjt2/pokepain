import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

export default ({mode}) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  const POKEDEX_API_HOST = process.env.VITE_ENV_HOST;
  const POKEDEX_API_PORT = process.env.VITE_POKEDEX_PORT;

  return defineConfig({
    plugins: [react()],
    server: {
      watch: {
       usePolling: true,
      },
      host: true, // Here
      strictPort: true,
      port: 8080, 
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

