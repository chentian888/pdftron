import React, { useState, useEffect, useRef } from 'react';
import { Upload, Row, Col, Button, Modal, message } from 'antd';
import { useModel } from '@umijs/max';
import PDF from '@/utils/pdf';
import ConvertedFile from '@/components/ConvertedFile';
import PdfSecurity from '@/components/PdfSecurity';
import type { UploadProps } from 'antd/es/upload/interface';

const { Dragger } = Upload;

const Security: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [loading, setLoading] = useState<boolean>(false);
  const [hasPassword, setHasPassword] = useState<boolean>(false);
  const { setBread } = useModel('global');
  const {
    fileList,
    success,
    setSuccess,
    onRemove,
    beforeUpload2,
    convertList,
    setConvertList,
    resetList,
  } = useModel('files');
  const {
    instance,
    showWebviewer,
    setShowWebviewer,
    ready,
    setReady,
    initWebViewer,
    webviewerTtile,
  } = useModel('pdf');

  const baseData = {
    accept: '.pdf',
    multiple: false,
    title: 'PDF加解密',
    desc: 'PDF加密解密',
  };

  const viewer = useRef<HTMLDivElement>(null);

  const props: UploadProps = {
    onRemove,
    beforeUpload: beforeUpload2,
    fileList,
    accept: baseData.accept,
    showUploadList: false,
    multiple: baseData.multiple || false,
  };

  // 继续
  const going = () => {
    resetList();
  };

  // 页面卸载
  const pageUmount = () => {
    going();
    setReady(false);
    setBread([]);
  };

  useEffect(() => {
    setBread([{ title: '首页', link: '/' }, { title: 'PDF加解密' }]);
    if (viewer.current) {
      initWebViewer(viewer.current!);
    }
    return pageUmount;
  }, []);

  // 检测是否有密码
  const checkHasPwd = async () => {
    const haspwd = await PDF.hasPassword(instance!, fileList[0]);
    setHasPassword(haspwd);
  };

  useEffect(() => {
    if (fileList.length) {
      checkHasPwd();
    }
  }, [fileList]);

  // 设置密码/接触密码
  const handleSetting = async (pwd: string, newPwd: string) => {
    const file = fileList[0];
    setLoading(true);
    try {
      let res: ConvertFile[];
      if (hasPassword) {
        const success = await await PDF.correctPassword(instance!, file, pwd);
        if (!success) throw '密码错误';
        res = await await PDF.decrypt(instance!, file, pwd, newPwd);
      } else {
        res = await await PDF.encrypt(instance!, file, pwd);
      }
      await PDF.downloadZip(res);
      setConvertList(res);
      setSuccess(true);
    } catch (e) {
      const msg = e as string;
      messageApi.open({
        type: 'warning',
        content: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  // 文件列表
  const renderInitFile = () => {
    if (fileList?.length && !success) {
      return (
        <PdfSecurity
          file={fileList[0]!}
          hasPassword={hasPassword}
          loading={loading}
          setting={handleSetting}
        />
      );
    }
  };

  // 转换为image列表
  const renderConvertFile = () => {
    const list = convertList.map((file, index) => (
      <Col span={4} key={index}>
        <ConvertedFile convert={file} index={index} />
      </Col>
    ));
    if (success) {
      return <Row gutter={[16, 16]}>{list}</Row>;
    }
  };

  const downloadAll = async () => {
    await PDF.downloadZip(convertList);
  };

  // 内容区域
  const renderInitContent = () => {
    if (!fileList.length) {
      return (
        <div className="w-1/3 m-auto h-full flex justify-center items-center flex-col relative z-10">
          <div className="flex justify-center text-xl font-bold mb-6">
            {baseData.title}
          </div>
          <div className="text-gray-400 text-center mb-14">{baseData.desc}</div>
          <Button
            className="mb-8"
            type="primary"
            size="large"
            block
            loading={!ready}
            ghost
          >
            可以拖拽至此
          </Button>
          <Upload className="w-full" {...props}>
            <Button
              className="w-full"
              type="primary"
              size="large"
              loading={!ready}
              block
            >
              选择本地文件
            </Button>
          </Upload>
        </div>
      );
    }
  };

  // 操作按钮
  const renderAction = () => {
    if (success) {
      return (
        <div className="w-1/3 absolute bottom-20 left-1/2 -translate-x-1/2">
          <Button type="primary" size="large" block onClick={downloadAll}>
            全部下载
          </Button>
          <div className="text-center mt-4 cursor-pointer" onClick={going}>
            继续
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {contextHolder}
      <Dragger
        disabled={!ready}
        className="w-full min-h-full h-full absolute bg-[#f2f3f6] rounded-lg top-0 left-0"
        {...props}
        openFileDialogOnClick={false}
      ></Dragger>
      {renderInitFile()}
      {renderInitContent()}
      {renderConvertFile()}

      {renderAction()}
      <Modal
        className="webviewer-modal"
        title={webviewerTtile}
        centered
        forceRender
        open={showWebviewer}
        onOk={() => setShowWebviewer(false)}
        onCancel={() => setShowWebviewer(false)}
        width={'100%'}
        footer={null}
      >
        <div className="webviewer" ref={viewer}></div>
      </Modal>
    </>
  );
};

export default Security;
