import { useState } from 'react';
import { login, register, getUserInfo } from '@/services/user';

export default () => {
  const [showLogin, setShowLoginModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  const [userInfo, setUserInfo] = useState<API.UserInfo>();

  const userLogin = async (params: API.LoginParams) => {
    const { data } = await login(params);
    console.log(data);
    setUserInfo(data.user);
    return data;
  };

  const getUserVipInfo = async () => {
    const { data } = await getUserInfo();
    console.log(data);
  };

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
    userInfo,
  };
};
