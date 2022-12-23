import React, { useState } from 'react';
import { Modal } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import LoginForm from './components/LoginForm';
import RegistryForm from './components/RegistryForm';
import './index.less';

const LoginModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [formType, setFormType] = useState('1'); // 1-登录/2-注册
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showLoginForm = () => {
    setFormType('1');
  };
  const showRegistryForm = () => {
    setFormType('2');
  };

  return (
    <Modal
      className="login-modal"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      closeIcon={<CloseCircleOutlined />}
      footer={null}
      width={1047}
    >
      <div className="login-modal-content">
        <div className="left-bg">
          <img src={require('./img/login-bg.png')} alt="" />
        </div>
        <div className="right-form">
          <div className="login-panel">
            <div className="login-title">欢迎使用PDF万能编辑器</div>
            {formType === '1' ? (
              <LoginForm changeType={() => showRegistryForm()} />
            ) : (
              <RegistryForm changeType={() => showLoginForm()} />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
