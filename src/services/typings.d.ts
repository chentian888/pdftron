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

  interface UserInfo {
    id: number;
    userName: string;
    nickName: null;
    password: string;
    status: string;
    vip: string;
    email: null;
    phone: null;
    sex: null;
    avatar: null;
    userType: string;
    createBy: number;
    createTime: string;
    updateBy: number;
    updateTime: string;
    openid: null;
    delFlag: number;
  }
  interface LoginRes {
    user: UserInfo;
    permissions: null;
    loginDate: string;
    authorities: null;
    enabled: boolean;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
    password: string;
    username: string;
  }

  interface UserVipInfo {
    userId: null;
    vipName: string;
    expirationTime: string;
    createTime: string;
    updateTime: string;
    vip: boolean;
  }

  interface RegisterParams {
    code: string;
    password: string;
    userName: string;
    nickName?: string;
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
    subject?: string;
  }
  // interface SendEmailRes {}

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

  interface PayPayRes {
    approve: string;
    paymentId: string;
  }

  type UserGenderEnum = 'MALE' | 'FEMALE';

  interface UploadFileParams {
    files: File;
  }

  interface UploadFileRes {
    fileId: string;
  }

  interface ConvertOfficeParams {
    fileId: string;
    convertType: '1' | '2' | '3';
  }

  interface ConvertOfficeRes {
    state: number;
    convertedPaths: string[];
  }

  type SysSettingParams = Record<string, unknown>;

  interface SysSettingRes {
    windows_download_url: string;
    web_content_english: string;
    android_download_english: string;
    android_download_china: string;
    wndows_download_open: string;
    mac_download_open: string;
    video_english: string;
    video_china: string;
    web_content: string;
    iphone_pdf_ios_download: string;
    web_content_open_url: string;
    iphone_scan_ios_download: string;
  }
}
