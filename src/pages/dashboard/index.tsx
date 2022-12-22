// import { PageContainer } from '@ant-design/pro-components';
// import { Access, useAccess } from '@umijs/max';
// import { Button } from 'antd';
import { NavLink, Outlet } from '@umijs/max';
import React from 'react';
import { Layout } from 'antd';
import './index.less';
const { Header, Content, Sider } = Layout;

const Dashboard: React.FC = () => {
  const headerMenuItem = [
    { name: '转换为PDF', to: '/dashboard/topdf' },
    { name: 'PDF转其它', to: '/dashboard/frompdf' },
    { name: 'PDF功能', to: '/dashboard/editpdf' },
  ];
  const sideMenuItem = [
    { name: '打开文档', to: '/dashboard/openpdf' },
    { name: '创建文档', to: '/dashboard/newpdf' },
    { name: '最近文档', to: '/dashboard' },
  ];
  return (
    <Layout className="pdftron">
      <Header className="pdf-header">
        <div className="pdf-logo">PDF万能编辑器</div>
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
        <div className="pdf-lang-select">
          <div className="pdf-lang-item active">中文</div>
          <div className="pdf-lang-item">EN</div>
        </div>
        <div className="pdf-user"></div>
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
