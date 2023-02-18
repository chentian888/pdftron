import React from 'react';
import { Button, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link, useModel } from '@umijs/max';
import LoginModal from '@/components/LoginModal';
import PayModal from '@/components/PayModal';

interface Props {
  block?: boolean;
}

const Header: React.FC<Props> = (props) => {
  const { block = false } = props;
  const { setShowLoginModal, setShowVipModal, userInfo } = useModel('user');

  return (
    <div className={`h-[101px]  ${block ? 'bg-white' : ''}`}>
      <LoginModal />
      <PayModal />
      <div
        className={`${
          block ? 'w-11/12' : 'w-1200'
        } m-auto h-full flex justify-between items-center`}
      >
        <div className="text-lg h-full">
          <Link
            to="/"
            className=" text-black no-underline text-lg flex justify-start items-center h-full"
          >
            <img className="block w-[50px]" src="/logo.png" alt="" />{' '}
            万能PDF编辑
          </Link>
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
          {userInfo?.id ? (
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
  );
};

export default Header;
