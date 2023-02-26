import React from 'react';
import { Button, Avatar, Breadcrumb, Modal, Space, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link, useModel } from '@umijs/max';
import LoginModal from '@/components/LoginModal';
import PayModal from '@/components/PayModal';

interface Props {
  block?: boolean;
}

const Header: React.FC<Props> = (props) => {
  const { block = false } = props;
  const { initialState } = useModel('@@initialState');
  const { setShowLoginModal, setShowVipModal } = useModel('user');
  const { bread } = useModel('global');
  // const supportFile = [
  //   '.pdf',
  //   '.jpg',
  //   '.jpeg',
  //   '.png',
  //   '.doc',
  //   '.docx',
  //   '.xls',
  //   '.xlsx',
  //   '.ppt',
  //   '.pptx',
  //   '.md',
  //   '.xod',
  // ];
  const SupportFile = () => {
    const fileList = [
      '.pdf',
      '.jpg',
      '.jpeg',
      '.png',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.ppt',
      '.pptx',
      '.md',
      '.xod',
    ];
    return (
      <Space size={[0, 8]} wrap>
        {fileList.map((ele, index) => (
          <Tag key={index} color="success">
            {ele}
          </Tag>
        ))}
      </Space>
    );
  };
  const handleLogoClick = () => {
    Modal.info({
      title: 'PDF Edit All 支持以下格式文件',
      content: <SupportFile />,
      onOk() {},
    });
  };
  return (
    <>
      <div className={`h-[101px]  ${block ? 'bg-white' : ''}`}>
        <LoginModal />
        <PayModal />
        <div
          className={`${
            block ? 'w-11/12' : 'w-1200'
          } m-auto h-full flex justify-between items-center`}
        >
          <div className="text-lg h-full">
            <div
              className=" text-black no-underline text-lg flex justify-start items-center h-full cursor-pointer"
              onClick={handleLogoClick}
            >
              <img className="block w-[50px]" src="/logo.png" alt="" /> PDF Edit
              All
            </div>
          </div>

          <div className="flex justify-end items-center">
            <Link to="/" className="px-8 text-black no-underline text-lg">
              首页
            </Link>
            <div
              onClick={() => setShowVipModal(true)}
              className="px-8 text-black no-underline text-lg cursor-pointer"
            >
              购买
            </div>
            {initialState?.id ? (
              <Avatar
                style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }}
                size="large"
                icon={<UserOutlined />}
              ></Avatar>
            ) : (
              <Button type="primary" onClick={() => setShowLoginModal(true)}>
                登录/注册
              </Button>
            )}
          </div>
        </div>
      </div>
      {bread.length ? (
        <div className="w-1200 m-auto mb-3">
          <Breadcrumb>
            {bread.map((b, index) => {
              return (
                <Breadcrumb.Item key={index}>
                  {b.link ? (
                    <Link to={b.link}>{b.title}</Link>
                  ) : (
                    <span>{b.title}</span>
                  )}
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default Header;
