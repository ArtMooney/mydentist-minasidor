import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VitePurgeCss from "vite-plugin-purgecss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VitePurgeCss()],
  build: {
    assetsInlineLimit: 51200,
    rollupOptions: {
      output: {
        manualChunks: () => "app",
      },
    },
  },
});
