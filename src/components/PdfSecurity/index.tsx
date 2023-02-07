import React from 'react';
import { Input, Button } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';

interface Props {
  hasPassword?: boolean;
  file: UploadFile;
  setting: () => void;
}
const PdfDeEncrypt: React.FC<Props> = (props) => {
  const { hasPassword = false, file, setting } = props;
  return (
    <div className="w-2/6 z-10 relative m-auto">
      <div className="flex justify-center text-xl">PDF加密解密</div>
      <div className="flex justify-between  my-6">
        <div className=" flex items-center  text-gray-400">
          PDF名称：{file?.name}
        </div>
        <div>
          <Button type="primary">预览</Button>
        </div>
      </div>
      <Input size="large" placeholder="请输入密码" />
      <div className="text-gray-400 mt-4 mb-6">
        {hasPassword
          ? '该PDF文件有密码，可以设置和删除密码'
          : '该PDF文件没有密码，可以设置密码'}
      </div>
      {hasPassword && (
        <Input className=" mb-10" size="large" placeholder="请输入新密码" />
      )}

      <Button block size="large" type="primary" onClick={setting}>
        设置
      </Button>
    </div>
  );
};

export default PdfDeEncrypt;
