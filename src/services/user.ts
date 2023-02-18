import { request } from '@umijs/max';

// 登录
export async function login(
  body: API.LoginParams,
  options?: { [key: string]: any },
) {
  return request<API.HttpResponse<API.LoginRes>>('/api/user/login', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

// 注册
export async function register(
  body: API.RegisterParams,
  options?: { [key: string]: any },
) {
  return request<API.HttpResponse<API.RegisterParams>>('/api/user/register', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

// 忘记密码
export async function restPassword(
  body: API.RestPasswordParams,
  options?: { [key: string]: any },
) {
  return request<API.HttpResponse>('/api/user/restPassword', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

// 发送邮箱验证码
export async function sendEmailCode(
  params: API.SendEmailParams,
  options?: { [key: string]: any },
) {
  return request<API.HttpResponse<null>>('/api/user/sendEmailCode', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 用户信息
export async function getUserInfo(
  params = {},
  options?: { [key: string]: any },
) {
  return request<API.HttpResponse<API.UserVipInfo>>('/api/user/getUserInfo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 商品列表
export async function vipList(params = {}, options?: { [key: string]: any }) {
  return request<API.HttpResponse<API.VipRes[]>>('/api/vip/dictList/v2/007', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// paypal支付
export async function paypal(id: number, options?: { [key: string]: any }) {
  return request<API.HttpResponse<API.PayPayRes>>(`/api/paypal/pay/${id}`, {
    method: 'POST',
    ...(options || {}),
  });
}

// 支付宝支付
export async function alipay(id: number, options?: { [key: string]: any }) {
  return request<API.HttpResponse<string>>(`/api/alipay/pay/${id}`, {
    method: 'POST',
    ...(options || {}),
  });
}

// 文件上传
export async function uploadFile(
  body: API.UploadFileParams,
  options?: { [key: string]: any },
) {
  return request<API.HttpResponse<string>>(`/api/common/multiUpload`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

// pdf转word/xlsx/pptx
export async function pdf2Office(
  body: API.ConvertOfficeParams,
  options?: { [key: string]: any },
) {
  return request<API.HttpResponse<string>>(`/api/pdf/asyncConvert`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

// 查询转换状态
export async function convertStatus(
  params: unknown,
  options?: { [key: string]: any },
) {
  return request<API.HttpResponse<string>>(`/api/pdf/queryState`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
