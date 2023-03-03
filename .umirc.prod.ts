import { defineConfig } from '@umijs/max';

export default defineConfig({
  mock: false,
  define: {
    ENV: 'production',
    TOTAL_SIZE: 500, // 单位M
    SINGLE_SIZE: 100, // 单位M
    LK: 'ZGVtbzpkZW1vQHBkZnRyb24uY29tOjczYjBlMGJkMDFlNzdiNTViM2MyOTYwNzE4NGU4NzUwYzJkNWU5NGRhNjdkYThmMWQw',
    BROWSER_FILE: 'https://www.pdfinto.com/file/',
    API_URL: 'https://www.pdfinto.com',
  },
});
