declare namespace API {
  interface HttpResponse<T = null> {
    code: number;
    msg: string;
    data: T;
  }

  interface LoginParams {
    userName: string;
    password: string;
  }
  // interface LoginRes {}

  interface RegisterParams {
    code: string;
    password: string;
    userName: string;
    nickName: string;
    phone?: string;
    avatar?: string;
    openid?: string;
  }

  interface RestPasswordParams {
    code: string;
    password: string;
    userName: string;
  }

  // interface RegisterRes {}

  interface SendEmailParams {
    email: string;
    subject: string;
  }
  // interface SendEmailRes {}

  // interface UserInfoRes {}

  // interface VipParams {}
  interface VipRes {
    id: number;
    name: string;
    describes: string;
    secondNumber: number;
    originalPrice: number;
    totalPrice: number;
    status: number;
    type: number;
    sortNumber: number;
  }

  type UserGenderEnum = 'MALE' | 'FEMALE';

  interface UserInfo {
    id?: string;
    name?: string;
    /** nick */
    nickName?: string;
    /** email */
    email?: string;
    gender?: UserGenderEnum;
  }

  interface UploadFileParams {
    file: File;
  }

  interface ConvertOfficeParams {
    id: number;
    convertType: 1 | 2 | 3;
  }
}
