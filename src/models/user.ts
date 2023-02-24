import { useState } from 'react';
import { useModel } from '@umijs/max';
import Cache from '@/utils/cache';
import { login, register, getUserInfo, restPassword } from '@/services/user';

export default () => {
  const { setInitialState } = useModel('@@initialState');

  const [showLogin, setShowLoginModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);

  // 获取用户信息
  const getUserVipInfo = async () => {
    const { data } = await getUserInfo();
    const isVip = data.vip ? '1' : '0';
    console.log(data);
    return isVip;
  };

  // 登录
  const userLogin = async (params: API.LoginParams) => {
    try {
      const { data, headers } = await login(params, {
        getResponse: true,
      });
      const token = headers.authorization || '';
      Cache.setCookieToken(token);
      const isVip = await getUserVipInfo();
      Cache.setCookieUserInfo({ ...data?.data.user, vip: isVip });
      setInitialState({ ...data.data.user, vip: isVip });
      return data;
    } catch (e) {}
  };

  // 注册
  const userRegister = async (params: API.RegisterParams) => {
    await register(params);
    const data = await userLogin({
      userName: params.userName,
      password: params.password,
    });
    console.log(data);

    return data;
  };

  // 忘记密码
  const userResetPassword = async (params: API.RegisterParams) => {
    await restPassword(params);
    const data = await userLogin({
      userName: params.userName,
      password: params.password,
    });
    return data;
  };

  return {
    showLogin,
    setShowLoginModal,
    showVipModal,
    setShowVipModal,
    userLogin,
    getUserVipInfo,
    userRegister,
    userResetPassword,
  };
};
