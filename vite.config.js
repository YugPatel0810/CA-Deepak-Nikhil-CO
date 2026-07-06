import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        accounting: resolve(__dirname, 'src/pages/accounting.html'),
        audit: resolve(__dirname, 'src/pages/audit-assurance.html'),
        corporate: resolve(__dirname, 'src/pages/corporate-services.html'),
        management: resolve(__dirname, 'src/pages/management-consultancy.html'),
        taxation: resolve(__dirname, 'src/pages/taxation.html')
      }
    }
  }
});
