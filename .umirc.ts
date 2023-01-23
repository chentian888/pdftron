import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: false,
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      title: 'PDF万能编辑器',
      path: '/home',
      component: './home',
    },
    {
      title: 'pdf转换',
      path: '/convertFrom',
      component: '@/layouts/ConvertLayout',
      routes: [
        {
          title: 'Word转PDF',
          path: ':from',
          component: './convertFrom',
        },
      ],
    },
    {
      title: '转换为pdf',
      path: '/convertTo',
      component: '@/layouts/ConvertLayout',
      routes: [
        {
          title: '转换为pdf',
          path: ':to',
          component: './convertTo',
        },
      ],
    },
  ],

  locale: {
    default: 'zh-CN',
    baseSeparator: '-',
  },

  npmClient: 'pnpm',
  proxy: {
    '/api': {
      target: 'https://www.pdfinto.com',
      changeOrigin: true,
    },
  },
  tailwindcss: {},
});
