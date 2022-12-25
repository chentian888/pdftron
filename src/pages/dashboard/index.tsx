import {
  NavLink,
  Outlet,
  useIntl,
  setLocale,
  getLocale,
  FormattedMessage,
} from '@umijs/max';
import React, { useEffect } from 'react';
import { Layout, Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import LoginModal from '@/components/LoginModal';
import PayModal from '@/components/PayModal';
// import { sendEmailCode } from '@/services/userController';
import './index.less';
import logo from './img/logo.png';
const { Header, Content, Sider } = Layout;

const Dashboard: React.FC = () => {
  const intl = useIntl();
  const localLang = getLocale();

  useEffect(() => {
    // sendEmailCode({ email: 'chentian', subject: '测试注册验证码' });
  }, []);
  // 切换语言
  const handleLangSelect = (lang = 'zh-CN') => {
    // 切换时不刷新页面
    setLocale(lang, false);
  };

  // 顶部菜单
  const headerMenuItem = [
    { name: 'converttopdf', to: '/dashboard/topdf' },
    { name: 'convertfrompdf', to: '/dashboard/frompdf' },
    { name: 'pdffunc', to: '/dashboard/edit' },
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
    { name: 'openpdf', to: '/dashboard/open', icon: 'icon-menu-open' },
    { name: 'createpdf', to: '/dashboard/new', icon: 'icon-menu-create' },
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
      <LoginModal />
      <PayModal />
      <Header className="pdf-header">
        <div className="pdf-logo">
          <img className="logo" src={logo} alt="" />
          <FormattedMessage id="title" />
        </div>
        <div className="pdf-menu">{renderHeaderMenu()}</div>
        <Space size={100}>
          <div className="pdf-lang-select">
            <div
              className={`pdf-lang-item ${
                localLang === 'zh-CN' ? 'active' : ''
              }`}
              onClick={() => handleLangSelect('zh-CN')}
            >
              中文
            </div>
            <div
              className={`pdf-lang-item ${
                localLang === 'en-US' ? 'active' : ''
              }`}
              onClick={() => handleLangSelect('en-US')}
            >
              EN
            </div>
          </div>
          <div className="pdf-user">
            <Avatar size={35} icon={<UserOutlined />} />
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
