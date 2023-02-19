import { useState } from 'react';
import { useModel } from '@umijs/max';
import Cache from '@/utils/cache';
import { login, register, getUserInfo } from '@/services/user';

export default () => {
  const { setInitialState } = useModel('@@initialState');

  const [showLogin, setShowLoginModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);

  // 登录
  const userLogin = async (params: API.LoginParams) => {
    const { data, headers } = await login(params, {
      getResponse: true,
    });
    const token = headers.authorization || '';
    Cache.setCookieToken(token);
    Cache.setCookieUserInfo(data?.data.user);
    setInitialState(data.data.user);
    return data;
  };

  // 获取用户信息
  const getUserVipInfo = async () => {
    const { data } = await getUserInfo();
    console.log(data);
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

  return {
    showLogin,
    setShowLoginModal,
    showVipModal,
    setShowVipModal,
    userLogin,
    getUserVipInfo,
    userRegister,
  };
};
