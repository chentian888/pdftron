// @ts-nocheck
import { matchRoutes } from '@umijs/max';
import type { RequestConfig, AxiosResponse } from '@umijs/max';
import { message, Modal } from 'antd';
import Cache from '@/utils/cache';
// 运行时配置
import './style/index.less';
// import '../tailwind.css';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<Record<string, unknown>> {
  const initInfo = Cache.getCookieUserInfo();
  console.log('initialState================', initInfo);
  return initInfo;
}

export function onRouteChange({ clientRoutes, location }) {
  const route = matchRoutes(clientRoutes, location.pathname)?.pop()?.route;
  if (route) {
    document.title = route.title || '';
  }
}

export const request: RequestConfig = {
  timeout: 1000 * 60 * 3,
  errorConfig: {
    errorHandler() {},
    errorThrower() {},
  },
  requestInterceptors: [],
  responseInterceptors: [
    (response) => {
      const { data } = response as AxiosResponse<API.HttpResponse>;
      if (data.code === 401) {
        Cache.clearCookie();
        Modal.error({
          title: '登录失效',
          content: '用户信息失效请重新登录',
          okText: '重新登录',
          onOk() {
            window.location.reload();
          },
        });
        throw new Error('登录失效');
      } else if (data.code >= 300) {
        message.error(data.msg);
        throw new Error(data.msg);
      }
      return response;
    },
  ],
};
