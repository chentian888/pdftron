import React from 'react';
import { Input, Button } from 'antd';

const PdfEncrypt: React.FC = () => {
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
      <Input size="large" placeholder="请输入密码" />
      <div className=" text-gray-400 mt-4 mb-10">
        该PDF文件没有密码，可以设置密码
      </div>
      <Button block size="large" type="primary">
        预览
      </Button>
    </div>
  );
};

export default PdfEncrypt;
