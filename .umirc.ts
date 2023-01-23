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
      title: 'PDF万能编辑器',
      path: '/dashboard',
      component: './dashboard',
      routes: [
        {
          title: '转换为PDF',
          path: 'topdf',
          component: './convertToPDF',
        },

        {
          title: 'PDF转其它',
          path: 'frompdf',
          component: './convertFromPDF',
        },

        {
          title: 'PDF功能',
          path: 'edit',
          component: './editPDF',
        },

        {
          title: '打开文档',
          path: 'open',
          component: './openPDF',
        },

        {
          title: '创建文档',
          path: 'new',
          component: './newPDF',
        },

        {
          title: '最近文档',
          path: 'recent',
          component: './recentPDF',
        },
      ],
    },

    {
      title: '编辑',
      path: '/editor',
      component: './editor',
    },

    {
      title: 'pdf转换',
      path: '/convert',
      component: '@/layouts/ConvertLayout',
      routes: [
        {
          title: 'pdf转jpg',
          path: 'toJpg',
          component: './pdfToJpg',
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
