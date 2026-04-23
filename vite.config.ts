import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set `base` to '/<your-repo-name>/' before deploying to GitHub Pages.
  // For example, if your repo is github.com/you/house-hunters, use '/house-hunters/'.
  // Using './' by default so `npm run preview` works without any config change.
  base: './',
});
