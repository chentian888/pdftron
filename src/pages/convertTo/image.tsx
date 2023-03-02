import React, { useState, useEffect, useRef } from 'react';
import { Upload, Row, Col, Button, Modal, Spin, message } from 'antd';
import { useModel } from '@umijs/max';
// import DragedFile from '@/components/DragedFile';
import ConvertedFile from '@/components/ConvertedFile';
// import PermissionBtn from '@/components/PermissionBtn';
import type { UploadProps } from 'antd/es/upload/interface';
import PDF from '@/utils/pdf';

const { Dragger } = Upload;

const ConvertFrom: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { setBread } = useModel('global');
  const {
    fileList,
    success,
    setSuccess,
    onRemove,
    beforeUpload,
    convertList,
    setConvertList,
    resetList,
  } = useModel('files');
  const {
    instance,
    showWebviewer,
    ready,
    setReady,
    setShowWebviewer,
    initWebViewer,
    webviewerTtile,
  } = useModel('pdf');

  const baseData = {
    accept: '.pdf',
    multiple: false,
    free: true,
    title: 'PDF转图片',
    desc: 'PDF转图片（jpeg,png）',
  };

  const viewer = useRef<HTMLDivElement>(null);
  const props: UploadProps = {
    onRemove,
    beforeUpload,
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
    setBread([{ title: '首页', link: '/' }, { title: baseData.title }]);
    if (viewer.current) {
      initWebViewer(viewer.current!);
    }
    return pageUmount;
  }, []);

  // 转换为image列表
  const renderConvertFile = () => {
    const list = convertList.map((file, index) => (
      <Col span={4} key={index}>
        <ConvertedFile convert={file} index={index} />
      </Col>
    ));
    if (convertList.length) {
      return <Row gutter={[16, 16]}>{list}</Row>;
    }
  };

  const pdf2imageCallback = (res: ConvertFile[]) => {
    setConvertList([...convertList, ...res]);
  };

  const downloadAll = async () => {
    await PDF.downloadZip(convertList);
  };

  // 转换
  const convert = async () => {
    try {
      setLoading(true);
      // 转blob
      const res = await PDF.pdf2image(instance!, fileList, pdf2imageCallback);
      // 下载
      await PDF.downloadZip(res);

      setSuccess(true);
    } catch (e) {
      message.error('转换失败请检查文档是否有密码或已损坏！');
    } finally {
      setLoading(false);
    }
  };

  // pdf转图片选择完文件之后直接进行转换
  useEffect(() => {
    if (fileList.length) {
      convert();
    }
  }, [fileList]);

  // 内容区域
  const renderInitContent = () => {
    if (!fileList.length) {
      return (
        <div className="w-1/3 m-auto min-h-full flex justify-center items-center flex-col relative z-10">
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
          <Upload className="w-full" disabled={!ready} {...props}>
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
    return '';
  };

  return (
    <>
      {loading && (
        <Spin
          size="large"
          tip="文件转换中请耐心等待"
          className="w-full h-full absolute bg-black bg-opacity-5 rounded-lg top-0 left-0 z-10 flex justify-center items-center flex-col"
        ></Spin>
      )}

      <Dragger
        disabled={!ready}
        className="w-full min-h-full h-full absolute bg-[#f2f3f6] rounded-lg top-0 left-0"
        {...props}
        openFileDialogOnClick={false}
      ></Dragger>
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

export default ConvertFrom;
