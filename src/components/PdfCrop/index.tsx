import React from 'react';
import { Input, Button } from 'antd';

const PdfCrop: React.FC = () => {
  return (
    <div className="w-2/6 z-10 relative m-auto">
      <div className="flex justify-center text-xl">PDF加密解密</div>
      <div className="flex justify-between  my-6">
        <div className=" flex items-center  text-gray-400">
          PDF名称：我的手机
        </div>
        <div>
          <Button type="primary">预览</Button>
        </div>
      </div>
      <Input
        className=" mb-4"
        size="large"
        placeholder="请输入不需要裁剪的页码"
      />
      <div className="text-red-500 leading-7">
        该功能是为了解决用户，PDF每页有两页的内容，将每页裁 剪为2页的需求。
      </div>
      <div className="text-red-500 leading-7 mb-10">
        不输入则裁剪所有，有多个跳过的页“/”隔开，例：“1/3/6”
      </div>
      <div className="flex justify-between w-full mb-10">
        <div className="w-48 h-48 flex flex-col justify-center items-center bg-white rounded-lg border border-dashed border-purple-600">
          <img
            className=" w-[46px] h-[46px] block"
            src={require('./img/icon-corp-horizontal.png')}
            alt=""
          />
          <div className="mt-4">左右对半裁剪</div>
        </div>
        <div className="w-48 h-48 flex flex-col justify-center items-center  bg-white rounded-lg border border-dashed border-purple-600">
          <img
            className=" w-[46px] h-[46px] block"
            src={require('./img/icon-corp-vertical.png')}
            alt=""
          />
          <div className="mt-4">上下对半裁剪</div>
        </div>
      </div>
      <Button block size="large" type="primary">
        裁剪
      </Button>
    </div>
  );
};

export default PdfCrop;
