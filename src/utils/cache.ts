import Cookies from 'js-cookie';
export default class Cache {
  /**
   * 缓存用户信息
   * @param msg
   * @returns
   */
  static setCookieUserInfo(msg: API.UserInfo) {
    Cookies.set('userInfo', JSON.stringify(msg), { expires: 1 });
    return msg;
  }

  /***
   * 获取缓存中的用户信息
   */
  static getCookieUserInfo(): API.UserInfo | Record<string, unknown> {
    const info = Cookies.get('userInfo') || '{}';
    const res = JSON.parse(info!) as API.UserInfo;
    return res;
  }

  /**
   * 更新缓存用户信息
   * @param val
   */
  static updateCookieUserInfo(val: Record<string, unknown>) {
    const info = Cookies.get('userInfo');
    const res = JSON.parse(info!) as API.UserInfo;
    Cookies.set('userInfo', JSON.stringify({ ...res, ...val }), { expires: 1 });
  }

  /**
   * 缓存token
   * @param token
   * @returns
   */
  static setCookieToken(token: string) {
    Cookies.set('token', token);
    return token;
  }

  /**
   * 获取缓存token
   * @returns
   */
  static getCookieToken() {
    const res = Cookies.get('token');
    return res;
  }

  /**
   * 清除所有缓存
   */
  static clearCookie() {
    Cookies.remove('userInfo');
    Cookies.remove('token');
  }
}
