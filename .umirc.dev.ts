import { defineConfig } from '@umijs/max';

export default defineConfig({
  mock: false,
  define: {
    ENV: 'dev',
    TOTAL_SIZE: 500, // 单位M
    SINGLE_SIZE: 100, // 单位M
    LICENSE_KEY:
      'demo:demo@pdftron.com:73b0e0bd01e77b55b3c29607184e8750c2d5e94da67da8f1d0',
    BROWSER_FILE: 'https://www.pdfinto.com/file/',
    API_URL: 'https://www.pdfinto.com',
  },
  proxy: {
    '/api': {
      target: 'https://www.pdfinto.com',
      changeOrigin: true,
    },
    '/admin': {
      target: 'https://www.pdfinto.com',
      changeOrigin: true,
    },
  },
});
