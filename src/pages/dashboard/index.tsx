// import { PageContainer } from '@ant-design/pro-components';
// import { Access, useAccess } from '@umijs/max';
// import { Button } from 'antd';
import {
  NavLink,
  Outlet,
  useIntl,
  setLocale,
  FormattedMessage,
} from '@umijs/max';
import React, { useState } from 'react';
import { Layout, Avatar, Space, Modal, Button, Form, Input } from 'antd';
import { UserOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './index.less';
import logo from './img/logo.png';
const { Header, Content, Sider } = Layout;

const Dashboard: React.FC = () => {
  const intl = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // 切换语言
  const handleLangSelect = () => {
    // 切换时不刷新页面
    setLocale('en-US', false);
  };

  // 顶部菜单
  const headerMenuItem = [
    { name: 'converttopdf', to: '/dashboard/topdf' },
    { name: 'convertfrompdf', to: '/dashboard/frompdf' },
    { name: 'pdffunc', to: '/dashboard/editpdf' },
  ];

  // 顶部菜单
  const renderHeaderMenu = () => {
    return headerMenuItem.map((ele, index) => {
      return (
        <NavLink
          key={index}
          to={ele.to}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          <span>{intl.formatMessage({ id: ele.name })}</span>
        </NavLink>
      );
    });
  };

  // 左边菜单
  const sideMenuItem = [
    { name: 'openpdf', to: '/dashboard/openpdf', icon: 'icon-menu-open' },
    { name: 'createpdf', to: '/dashboard/newpdf', icon: 'icon-menu-create' },
    { name: 'recentpdf', to: '/dashboard/recent', icon: 'icon-menu-create' },
    { name: 'usercenter', to: '/dashboard/user', icon: 'icon-menu-vip' },
  ];

  // 左边菜单
  const renderSideMenu = () => {
    return sideMenuItem.map((ele, index) => {
      return (
        <NavLink
          key={index}
          to={ele.to}
          className={({ isActive }) =>
            isActive ? 'sider-menu-item active' : 'sider-menu-item'
          }
        >
          <img
            className="sider-menu-icon"
            src={require(`./img/${ele.icon}.png`)}
            alt=""
          />
          {intl.formatMessage({ id: ele.name })}
        </NavLink>
      );
    });
  };
  return (
    <Layout className="pdftron">
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
              <Form
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                colon={false}
                labelAlign="left"
              >
                <Form.Item label="邮箱账号" name="username">
                  <Input placeholder="请输入邮箱账号" />
                </Form.Item>
                <Form.Item label="验证码" name="password">
                  <Input placeholder="请输入验证码" />
                </Form.Item>

                <Form.Item label="密码" name="password">
                  <Input.Password placeholder="请输入密码" />
                </Form.Item>

                <Button type="primary" size="large" block htmlType="submit">
                  注册
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </Modal>
      <Header className="pdf-header">
        <div className="pdf-logo">
          <img className="logo" src={logo} alt="" />
          <FormattedMessage id="title" />
        </div>
        <div className="pdf-menu">{renderHeaderMenu()}</div>
        <Space size={100}>
          <div className="pdf-lang-select">
            <div className="pdf-lang-item active">中文</div>
            <div className="pdf-lang-item" onClick={() => handleLangSelect()}>
              EN
            </div>
          </div>
          <div className="pdf-user">
            <Avatar
              size={35}
              icon={<UserOutlined />}
              onClick={() => showModal()}
            />
          </div>
        </Space>
      </Header>
      <Layout>
        <Sider className="pdf-sider" width={230}>
          <div className="pdf-sider-menu">{renderSideMenu()}</div>
        </Sider>
        <Layout>
          <Content className="pdf-content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
