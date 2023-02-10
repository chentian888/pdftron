import React from 'react';
import { Button } from 'antd';
import { Link } from '@umijs/max';

const Header: React.FC = () => {
  return (
    <div className="h-[101px]">
      <div className="w-1200 m-auto h-full flex justify-between items-center">
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
          <Link to="/vip" className="px-8 text-black no-underline text-lg">
            购买
          </Link>

          <Link to="login" className="px-8 text-black no-underline text-lg">
            <Button type="primary">登录/注册</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
