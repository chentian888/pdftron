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
      redirect: '/dashboard/open',
    },

    {
      name: '首页',
      path: '/dashboard',
      component: './dashboard',
      title: 'PDF万能编辑器',
      routes: [
        {
          name: '转换为PDF',
          path: 'topdf',
          component: './convertToPDF',
          title: '转换为PDF',
        },

        {
          name: 'PDF转其它',
          path: 'frompdf',
          component: './convertFromPDF',
          title: 'PDF转其它',
        },

        {
          name: 'PDF功能',
          path: 'edit',
          component: './editPDF',
          title: 'PDF功能',
        },

        {
          name: '打开文档',
          path: 'open',
          component: './openPDF',
          title: '打开文档',
        },

        {
          name: '创建文档',
          path: 'new',
          component: './newPDF',
          title: '创建文档',
        },

        {
          name: '最近文档',
          path: 'recent',
          component: './recentPDF',
          title: '最近文档',
        },
      ],
    },

    {
      name: '编辑',
      path: '/editor',
      component: './editor',
      title: '编辑',
    },

    {
      name: 'pdf转换',
      path: '/convert',
      component: '@/layouts/ConvertLayout',
      title: 'pdf转换',
      routes: [
        {
          name: 'pdf转jpg',
          path: 'toJpg',
          component: './pdfToJpg',
          title: 'pdf转jpg',
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
