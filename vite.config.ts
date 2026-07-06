import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-three": ["three"],
          "vendor-gsap": ["gsap"],
        },
      },
    },
    target: "es2020",
  },
});
