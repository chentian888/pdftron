import React, { useState } from 'react';
import { Modal } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Link, useModel } from '@umijs/max';
import LoginForm from '@/components/LoginForm';
import RegistryForm from '@/components/RegistryForm';
import Feature from '@/components/Feature';
import './index.less';

const LoginModal: React.FC = () => {
  const { showLogin, setShowLoginModal } = useModel('user');
  const [formType, setFormType] = useState('1'); // 1-登录/2-注册
  const [registryFormType, setRegistryFormType] = useState('1'); // 1-注册/2-重置密码
  const handleOk = () => {
    setShowLoginModal(false);
  };

  const handleCancel = () => {
    setShowLoginModal(false);
  };

  const showLoginForm = () => {
    setFormType('1');
  };

  const showRegistryForm = () => {
    setFormType('2');
  };
  const showResetForm = () => {
    setRegistryFormType('2');
    setFormType('2');
  };

  const renderLoginForm = () => {
    return (
      <>
        <Feature />
        <div className="mb-10"></div>
        <LoginForm />
        <div className="flex justify-between px-5">
          <div
            onClick={showRegistryForm}
            className="no-underline text-black cursor-pointer"
          >
            去注册
          </div>
          <div
            onClick={showResetForm}
            className="no-underline text-black cursor-pointer"
          >
            忘记密码
          </div>
        </div>
        <div className="flex justify-center pt-10">
          注册表示同意
          <Link className="no-underline" to="/">
            《用户协议》
          </Link>
        </div>
      </>
    );
  };

  const renderRegistryForm = () => {
    return (
      <>
        <RegistryForm type={registryFormType} />
        <div
          onClick={showLoginForm}
          className=" text-center text-black no-underline m-auto block cursor-pointer"
        >
          已有账号，去登录
        </div>
      </>
    );
  };
  return (
    <Modal
      className="login-modal"
      open={showLogin}
      onOk={handleOk}
      onCancel={handleCancel}
      closeIcon={<CloseCircleOutlined />}
      footer={null}
      width={1047}
      maskClosable={false}
    >
      <div className="login-modal-content flex">
        <div className="left-bg w-1/2">
          <img
            className="block max-w-full max-h-full"
            src={require('./img/login-bg.png')}
            alt=""
          />
        </div>
        <div className="right-form w-1/2 px-10 flex justify-center items-center">
          <div className="login-panel w-full">
            {formType === '1' ? renderLoginForm() : renderRegistryForm()}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
