import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import { useModel } from '@umijs/max';
import Tools from '@/utils/tools';
import type { UploadFile } from 'antd/es/upload/interface';

interface Props {
  hasPassword?: boolean;
  file: UploadFile;
  loading: boolean;
  setting: (pwd: string, newPwd: string) => void;
}

const PdfDeEncrypt: React.FC<Props> = (props) => {
  const { hasPassword = false, file, setting, loading } = props;
  const { instance, setShowWebviewer, setWebviewerTtile } = useModel('pdf');
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  useEffect(() => {
    return () => {
      setPassword('');
      setNewPassword('');
    };
  }, []);

  // 预览
  const handlePreview = () => {
    const { UI, Core } = instance!;
    const { prefix, suffix } = Tools.fileMsg(file);
    setShowWebviewer(true);
    setWebviewerTtile(file.name);
    UI.loadDocument(file as any as File, {
      filename: prefix,
      extension: suffix,
    });
    Core.documentViewer.addEventListener('documentLoaded', () => {
      UI.setLayoutMode(UI.LayoutMode.Continuous);
    });
  };

  const passwordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const newPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleSetting = () => {
    setting(password, newPassword);
  };

  return (
    <div className="w-2/6 z-10 relative m-auto">
      <div className="flex justify-center text-xl">PDF加密解密</div>
      <div className="flex justify-between  my-6">
        <div className=" flex items-center  text-gray-400">
          PDF名称：{file?.name}
        </div>
        <div>
          <Button type="primary" onClick={handlePreview}>
            预览
          </Button>
        </div>
      </div>
      <Input
        size="large"
        value={password}
        maxLength={12}
        onChange={passwordChange}
        placeholder="请输入密码"
      />
      <div className="text-gray-400 mt-4 mb-6">
        {hasPassword
          ? '该PDF文件有密码，可以设置和删除密码'
          : '该PDF文件没有密码，可以设置密码'}
      </div>
      {hasPassword && (
        <Input
          className="mb-10"
          value={newPassword}
          maxLength={12}
          size="large"
          onChange={newPasswordChange}
          placeholder="请输入新密码"
        />
      )}

      <Button
        block
        size="large"
        type="primary"
        disabled={!password}
        loading={loading}
        onClick={handleSetting}
      >
        设置
      </Button>
    </div>
  );
};

export default PdfDeEncrypt;
