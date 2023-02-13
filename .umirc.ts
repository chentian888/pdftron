import { defineConfig } from '@umijs/max';

export default defineConfig({
  define: {
    LICENSE_KEY:
      'demo:demo@pdftron.com:73b0e0bd01e77b55b3c29607184e8750c2d5e94da67da8f1d0',
  },
  antd: {
    theme: {
      token: {
        colorPrimary: '#7F66FA',
      },
    },
  },
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: false,
  routes: [
    {
      path: '/',
      title: 'PDF万能编辑器',
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
    {
      title: '页面编辑',
      path: '/page',
      component: '@/layouts/ConvertLayout',
      routes: [
        {
          title: 'PDF合并',
          path: 'merge',
          component: './page/merge',
        },
        {
          title: '页面提取',
          path: 'extract',
          component: './page/extract',
        },
        {
          title: '页面分割',
          path: 'split',
          component: './page/split',
        },
        {
          title: '页面裁剪',
          path: 'crop',
          component: './page/crop',
        },
      ],
    },
    {
      title: '页面提取',
      path: '/extraction',
      component: '@/layouts/ConvertLayout',
      routes: [
        {
          title: 'PDF提取文字',
          path: 'text',
          component: './extraction/text',
        },
        {
          title: 'PDF提取图片',
          path: 'image',
          component: './extraction/image',
        },
      ],
    },
    {
      title: '页面编辑',
      path: '/content',
      component: '@/layouts/ConvertLayout',
      routes: [
        {
          title: 'PDF替换文字',
          path: 'replacetext',
          component: './content/replacetext',
        },
        {
          title: 'PDF删除文字数据',
          path: 'removetext',
          component: './content/removetext',
        },
        {
          title: 'PDF删除图片数据',
          path: 'removeimage',
          component: './content/removeimage',
        },
      ],
    },
    {
      title: 'PDF压缩',
      path: '/compress',
      component: '@/layouts/ConvertLayout',
      routes: [
        {
          title: 'PDF压缩',
          path: '',
          component: './compress',
        },
      ],
    },
    {
      title: 'PDF加解密',
      path: '/security',
      component: '@/layouts/ConvertLayout',
      routes: [
        {
          title: 'PDF加解密',
          path: '',
          component: './security',
        },
      ],
    },
    {
      title: '在线编辑',
      path: '/editor',
      component: './editor',
    },
    {
      title: '登录',
      path: '/login',
      component: './login',
    },
    {
      title: '注册',
      path: '/register',
      component: './register',
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
