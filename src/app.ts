import type { RequestConfig, AxiosResponse } from '@umijs/max';
import { message } from 'antd';
// 运行时配置
import './style/index.less';
// import '../tailwind.css';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const request: RequestConfig = {
  timeout: 1000,
  errorConfig: {
    errorHandler() {},
    errorThrower() {},
  },
  requestInterceptors: [],
  responseInterceptors: [
    (response) => {
      const { data } = response as AxiosResponse<API.HttpResponse>;
      if (data.code >= 300) {
        message.error(data.msg);
      }
      return response;
    },
  ],
};
