// import { PageContainer } from '@ant-design/pro-components';
// import { Access, useAccess } from '@umijs/max';
// import { Button } from 'antd';
import { NavLink, Outlet } from '@umijs/max';
import React from 'react';
import { Layout, Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './index.less';
import logo from './img/logo.png';
const { Header, Content, Sider } = Layout;

const Dashboard: React.FC = () => {
  const headerMenuItem = [
    { name: '转换为PDF', to: '/dashboard/topdf' },
    { name: 'PDF转其它', to: '/dashboard/frompdf' },
    { name: 'PDF功能', to: '/dashboard/editpdf' },
  ];
  const sideMenuItem = [
    { name: '打开文档', to: '/dashboard/openpdf', icon: 'icon-menu-open' },
    { name: '创建文档', to: '/dashboard/newpdf', icon: 'icon-menu-create' },
    { name: '最近文档', to: '/dashboard/recent', icon: 'icon-menu-create' },
    { name: '会员中心', to: '/dashboard/user', icon: 'icon-menu-vip' },
  ];
  return (
    <Layout className="pdftron">
      <Header className="pdf-header">
        <div className="pdf-logo">
          <img className="logo" src={logo} alt="" />
          PDF万能编辑器
        </div>
        <div className="pdf-menu">
          {headerMenuItem.map((ele, index) => {
            return (
              <NavLink
                key={index}
                to={ele.to}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {ele.name}
              </NavLink>
            );
          })}
        </div>
        <Space size={100}>
          <div className="pdf-lang-select">
            <div className="pdf-lang-item active">中文</div>
            <div className="pdf-lang-item">EN</div>
          </div>
          <div className="pdf-user">
            <Avatar size={35} icon={<UserOutlined />} />
          </div>
        </Space>
      </Header>
      <Layout>
        <Sider className="pdf-sider" width={230}>
          <div className="pdf-sider-menu">
            {sideMenuItem.map((ele, index) => {
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
                  {ele.name}
                </NavLink>
              );
            })}
          </div>
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
