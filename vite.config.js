import { defineConfig, loadEnv } from 'vite' // Import loadEnv
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => { // Add 'mode' parameter
  // Load environment variables based on the current mode (e.g., 'production')
  const env = loadEnv(mode, process.cwd(), ''); // Load all env vars

  return {
    plugins: [react()],
    // Use the base URL from the environment variable, or default to '/'
    base: env.VITE_APP_BASE_URL || '/',
  };
});