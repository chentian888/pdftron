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
      redirect: '/dashboard',
    },
    {
      name: '首页',
      path: '/dashboard',
      component: './dashboard',
      routes: [
        {
          name: '转换为PDF',
          path: 'topdf',
          component: './convertToPDF',
        },
        {
          name: 'PDF转其它',
          path: 'frompdf',
          component: './convertFromPDF',
        },
        {
          name: 'PDF功能',
          path: 'editpdf',
          component: './editPDF',
        },
        {
          name: '打开文档',
          path: 'openpdf',
          component: './openPDF',
        },
        {
          name: '创建文档',
          path: 'newpdf',
          component: './newPDF',
        },
      ],
    },
  ],
  locale: {
    default: 'zh-CN',
    baseSeparator: '-',
  },
  npmClient: 'pnpm',
});
